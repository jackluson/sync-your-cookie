import {
  check,
  checkCloudflareResponse,
  CookieOperator,
  extractDomainAndPort,
  ICookie,
  Message,
  MessageType,
  pullAndSetCookies,
  PushCookieMessagePayload,
  pushCookies,
  removeCookieItem,
  removeCookies,
  SendResponse,
} from '@sync-your-cookie/shared';

import { domainConfigStorage } from '@sync-your-cookie/storage/lib/domainConfigStorage';
import { domainStatusStorage } from '@sync-your-cookie/storage/lib/domainStatusStorage';

type HandleCallback = (response?: SendResponse) => void;

const handlePush = async (payload: PushCookieMessagePayload, callback: HandleCallback) => {
  const { sourceUrl, host, favIconUrl } = payload || {};
  try {
    await check();
    await domainConfigStorage.updateItem(host, {
      sourceUrl: sourceUrl,
      favIconUrl,
    });
    await domainStatusStorage.updateItem(host, {
      pushing: true,
    });
    const [domain] = await extractDomainAndPort(host);
    const cookies = await chrome.cookies.getAll({
      // url: activeTabUrl,
      domain: domain,
    });
    if (cookies?.length) {
      const res = await pushCookies(host, cookies);
      checkCloudflareResponse(res, 'push', callback);
    } else {
      callback({ isOk: false, msg: 'no cookies found', result: cookies });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    checkCloudflareResponse(err, 'push', callback);
  } finally {
    await domainStatusStorage.togglePushingState(host, false);
  }
};

const handlePull = async (activeTabUrl: string, domain: string, isReload: boolean, callback: HandleCallback) => {
  try {
    await check();
    await domainStatusStorage.togglePullingState(domain, true);
    const cookieMap = await pullAndSetCookies(activeTabUrl, domain, isReload);
    callback({ isOk: true, msg: 'Pull success', result: cookieMap });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    checkCloudflareResponse(err, 'pull', callback);
  } finally {
    await domainStatusStorage.togglePullingState(domain, false);
  }
};

const handleRemove = async (domain: string, callback: HandleCallback) => {
  try {
    await check();
    const res = await removeCookies(domain);
    if (res.success) {
      callback({ isOk: true, msg: 'Removed success' });
    } else {
      checkCloudflareResponse(res, 'remove', callback);
      // callback({ isOk: false, msg: 'Removed fail, please try again ', result: res });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    checkCloudflareResponse(err, 'remove', callback);

    // callback({ isOk: false, msg: (err as Error).message || 'remove fail, please try again ', result: err });
  }
};

const handleRemoveItem = async (domain: string, id: string, callback: HandleCallback) => {
  try {
    await check();
    const res = await removeCookieItem(domain, id);
    if (res.success) {
      callback({ isOk: true, msg: 'Deleted success' });
    } else {
      checkCloudflareResponse(res, 'delete', callback);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    checkCloudflareResponse(err, 'delete', callback);
  }
};

const handleEditItem = async (domain: string, oldItem: ICookie, newItem: ICookie, callback: HandleCallback) => {
  try {
    await check();
    const res = await CookieOperator.editCookieItem(domain, oldItem, newItem);
    if (res.success) {
      callback({ isOk: true, msg: 'Edited success' });
    } else {
      checkCloudflareResponse(res, 'edit', callback);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    checkCloudflareResponse(err, 'edit', callback);
  }
};
function handleMessage(
  message: Message,
  sender: chrome.runtime.MessageSender,
  callback: (response?: SendResponse) => void,
) {
  const type = message.type;
  switch (type) {
    case MessageType.PushCookie:
      handlePush(message.payload, callback);
      break;
    case MessageType.PullCookie:
      // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-non-null-asserted-optional-chain
      const activeTabUrl = message.payload.activeTabUrl || sender.tab?.url!;
      handlePull(activeTabUrl!, message.payload.domain, message.payload.reload, callback);
      break;
    case MessageType.RemoveCookie:
      handleRemove(message.payload.domain, callback);
      break;
    case MessageType.RemoveCookieItem:
      handleRemoveItem(message.payload.domain, message.payload.id, callback);
      break;
    case MessageType.EditCookieItem:
      handleEditItem(message.payload.domain, message.payload.oldItem, message.payload.newItem, callback);
      break;
    default:
      break;
  }
  return true;
}
export const refreshListen = async () => {
  chrome.runtime.onMessage.removeListener(handleMessage);
  chrome.runtime.onMessage.addListener(handleMessage);
};
