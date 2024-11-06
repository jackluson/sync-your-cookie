import { ErrorCode, WriteResponse } from '@lib/cloudflare';
import { MessageErrorCode, SendResponse } from '@lib/message';

export function debounce<T = unknown>(func: (...args: T[]) => void, timeout = 300) {
  let timer: number | null = null;
  return (...args: T[]) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      func.apply(this, args);
    }, timeout);
  };
}

export function checkCloudflareResponse(
  res: WriteResponse,
  scene: 'push' | 'pull' | 'remove',
  callback: (response?: SendResponse) => void,
) {
  if (res?.success) {
    callback({ isOk: true, msg: `${scene} success` });
  } else {
    const defaultErrMsg = `${scene} fail, please try again.`;

    const isAccountError = res?.errors?.length && res.errors[0].code === ErrorCode.NotFoundRoute;
    if (isAccountError) {
      callback({
        isOk: false,
        msg: 'cloudflare account info is incorrect.',
        code: MessageErrorCode.CloudflareNotFoundRoute,
        result: res,
      });
    } else {
      callback({ isOk: false, msg: defaultErrMsg, result: res });
    }
  }
}
