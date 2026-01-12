import { ErrorCode, WriteResponse } from '@lib/cloudflare';
import { MessageErrorCode, SendResponse } from '@lib/message';
import { accountStorage } from '@sync-your-cookie/storage/lib/accountStorage';
import { settingsStorage } from '@sync-your-cookie/storage/lib/settingsStorage';

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

const successSceneMap = {
  push: 'Pushed',
  pull: 'Pulled',
  remove: 'Removed',
  delete: 'Deleted',
  edit: 'Edited',
};

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
      callback({ isOk: true, msg: `${successSceneMap[scene]} success` });
    } else {
      const defaultErrMsg =
        res?.message?.toLowerCase().includes?.(scene) || ((statusCode || res.code) && res?.message)
          ? res?.message
          : `${scene} fail (status:${statusCode || res.code}), please try again.`;
      callback({ isOk: false, code: res?.code, msg: defaultErrMsg, result: res });
    }
  } else {
    if ((res as WriteResponse)?.success) {
      callback({ isOk: true, msg: `${successSceneMap[scene]} success` });
    } else {
      const cloudFlareErrors = [ErrorCode.NotFoundRoute, ErrorCode.NamespaceIdError, ErrorCode.AuthenicationError];
      const isAccountError = res?.errors?.length && cloudFlareErrors.includes(res.errors[0].code);
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

export async function extractDomainAndPort(url: string, isRemoveWWW = true): Promise<[string, string, string]> {
  let urlObj: URL;
  try {
    const maybeValidUrl = addProtocol(url);
    urlObj = new URL(maybeValidUrl);
  } catch (error) {
    return [url, '', url];
  }
  let hostname = urlObj.hostname;
  const port = urlObj.port;
  hostname = hostname.replace('http://', '').replace('https://', '');
  if (isRemoveWWW) {
    hostname = hostname.replace('www.', '');
  }
  // match ip address
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    return [hostname, port, hostname];
  }
  if (hostname.split('.').length <= 2) {
    return [hostname, port, hostname];
  }
  const includeLocalStorage = settingsStorage.getSnapshot()?.includeLocalStorage;
  if (includeLocalStorage) {
    return [hostname, port, hostname];
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
            const hasHostCookie = cookies.find(item => item.domain.includes(hostname));
            if (hasHostCookie) {
              resolve([hostname, port, hostname]);
            } else {
              const domain = cookies[0].domain;
              if (domain.startsWith('.')) {
                resolve([domain.slice(1), port, hostname]);
              } else {
                resolve([domain, port, hostname]);
              }
            }
          } else {
            // const match = hostname.match(/([^.]+\.[^.]+)$/);
            resolve([hostname, port, hostname]);
          }
        },
      );
    } catch (error) {
      console.error('error', error);
      resolve([hostname, port, hostname]);
    }
  });
}
