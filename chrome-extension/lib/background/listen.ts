import {
  check,
  checkCloudflareResponse,
  Message,
  MessageType,
  pullAndSetCookies,
  pushCookies,
  removeCookies,
  SendResponse,
} from '@sync-your-cookie/shared';
import { domainConfigStorage } from '@sync-your-cookie/storage/lib/domainConfigStorage';

type HandleCallback = (response?: SendResponse) => void;

const handlePush = async (domain: string, callback: HandleCallback) => {
  try {
    await check();
    await domainConfigStorage.togglePushingState(domain, true);
    const cookies = await chrome.cookies.getAll({
      // url: activeTabUrl,
      domain: domain,
    });
    if (cookies?.length) {
      const res = await pushCookies(domain, cookies);
      console.log(res);
      checkCloudflareResponse(res, callback);
    } else {
      callback({ isOk: false, msg: 'no cookies found', result: cookies });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    checkCloudflareResponse(err, callback);
  } finally {
    await domainConfigStorage.togglePushingState(domain, false);
  }
};

const handlePull = async (activeTabUrl: string, domain: string, isReload: boolean, callback: HandleCallback) => {
  try {
    await check();
    await domainConfigStorage.togglePullingState(domain, true);
    const cookieMap = await pullAndSetCookies(activeTabUrl, domain, isReload);
    callback({ isOk: true, msg: 'Pull success', result: cookieMap });
  } catch (err) {
    callback({ isOk: false, msg: (err as Error).message || 'pull fail, please try again ', result: err });
  } finally {
    await domainConfigStorage.togglePullingState(domain, false);
  }
};

const handleRemove = async (domain: string, callback: HandleCallback) => {
  try {
    await check();
    const res = await removeCookies(domain);
    console.log(res);
    if (res.success) {
      callback({ isOk: true, msg: 'Removed success' });
    } else {
      console.log('json.errors[0]', res.errors[0]);
      callback({ isOk: false, msg: 'Removed fail, please try again ', result: res });
    }
  } catch (err) {
    callback({ isOk: false, msg: (err as Error).message || 'remove fail, please try again ', result: err });
  }
};

export const initListen = async () => {
  function handleMessage(
    message: Message,
    sender: chrome.runtime.MessageSender,
    callback: (response?: SendResponse) => void,
  ) {
    const type = message.type;
    switch (type) {
      case MessageType.PushCookie:
        handlePush(message.payload.domain, callback);
        break;
      case MessageType.PullCookie:
        // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-non-null-asserted-optional-chain
        const activeTabUrl = message.payload.activeTabUrl || sender.tab?.url!;
        handlePull(activeTabUrl!, message.payload.domain, message.payload.reload, callback);
        break;
      case MessageType.RemoveCookie:
        handleRemove(message.payload.domain, callback);
        break;
      default:
        break;
    }
    return true;
  }
  chrome.runtime.onMessage.addListener(handleMessage);
};
