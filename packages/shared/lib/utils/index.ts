import { ErrorCode, WriteResponse } from '@lib/cloudflare';
import { MessageErrorCode, SendResponse } from '@lib/message';
import { accountStorage } from '@sync-your-cookie/storage/lib/accountStorage';

export function debounce<T = unknown>(func: (...args: T[]) => void, timeout = 300) {
  let timer: number | null | NodeJS.Timeout = null;
  return (...args: T[]) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      func.apply(this, args);
    }, timeout);
  };
}

export function checkResponseAndCallback(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: WriteResponse | Error | any,
  scene: 'push' | 'pull' | 'remove' | 'delete' | 'edit',
  callback: (response?: SendResponse) => void,
) {
  const accountInfo = accountStorage.getSnapshot();
  if (accountInfo?.selectedProvider === 'github') {
    const statusCode = res?.status;
    if (statusCode === 200 || statusCode === 201 || statusCode === 204) {
      callback({ isOk: true, msg: `${scene} success` });
    } else {
      const defaultErrMsg =
        res?.message?.toLowerCase().includes?.(scene) || (statusCode && res?.message)
          ? res?.message
          : `${scene} fail (status:${statusCode}), please try again.`;
      callback({ isOk: false, code: res?.code, msg: defaultErrMsg, result: res });
    }
  } else {
    if ((res as WriteResponse)?.success) {
      callback({ isOk: true, msg: `${scene} success` });
    } else {
      const cloudFlareErrors = [ErrorCode.NotFoundRoute, ErrorCode.NamespaceIdError, ErrorCode.AuthenicationError];
      const isAccountError = res?.errors?.length && cloudFlareErrors.includes(res.errors[0].code);
      console.log('checkResponseAndCallback->res', res);
      if (isAccountError) {
        callback({
          isOk: false,
          msg:
            res.errors[0].code === ErrorCode.NamespaceIdError
              ? 'cloudflare namespace Id info is incorrect.'
              : 'cloudflare account info is incorrect.',
          code: MessageErrorCode.CloudflareNotFoundRoute,
          result: res,
        });
      } else {
        const defaultErrMsg =
          res?.message?.toLowerCase().includes?.(scene) || (res?.code && res?.message)
            ? res?.message
            : `${scene} fail, please try again.`;
        callback({ isOk: false, code: res?.code, msg: defaultErrMsg, result: res });
      }
    }
  }
}
function addProtocol(uri: string) {
  return uri.startsWith('http') ? uri : `http://${uri}`;
}

export async function extractDomainAndPort(url: string, isRemoveWWW = true): Promise<[string, string]> {
  let urlObj: URL;
  try {
    const maybeValidUrl = addProtocol(url);
    urlObj = new URL(maybeValidUrl);
  } catch (error) {
    return [url, ''];
  }
  let domain = urlObj.hostname;
  const port = urlObj.port;
  domain = domain.replace('http://', '').replace('https://', '');
  if (isRemoveWWW) {
    domain = domain.replace('www.', '');
  }
  // match ip address
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) {
    return [domain, port];
  }
  if (domain.split('.').length <= 2) {
    return [domain, port];
  }
  return new Promise(resolve => {
    try {
      chrome.cookies.getAll(
        {
          url,
        },
        async cookies => {
          console.log('cookies', cookies);
          if (cookies) {
            const domain = cookies[0].domain;
            if (domain.startsWith('.')) {
              resolve([domain.slice(1), port]);
            } else {
              resolve([domain, port]);
            }
          } else {
            const match = domain.match(/([^.]+\.[^.]+)$/);
            resolve([match ? match[1] : '', port]);
          }
        },
      );
    } catch (error) {
      console.error('error', error);
      const match = domain.match(/([^.]+\.[^.]+)$/);
      resolve([match ? match[1] : '', port]);
    }
  });
}
