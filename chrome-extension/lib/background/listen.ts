import { Message, MessageType, pullAndSetCookies, pushCookies, SendResponse } from '@sync-your-cookie/shared';
import { cloudflareStorage, domainConfigStorage } from '@sync-your-cookie/storage';

const check = ({ isSilent = false } = {}) => {
  const cloudflareAccountInfo = cloudflareStorage.getSnapshot();
  if (!cloudflareAccountInfo?.accountId || !cloudflareAccountInfo.namespaceId || !cloudflareAccountInfo.token) {
    let message = 'Account ID is empty';
    if (!cloudflareAccountInfo?.namespaceId) {
      message = 'NamespaceId ID is empty';
    } else if (!cloudflareAccountInfo.token) {
      message = 'Token is empty';
    }
    // if (isSilent === false) {
    //   toast.error(message, {
    //     // description: 'Please set cloudflare account id',
    //     action: {
    //       label: 'go to settings',
    //       onClick: () => {
    //         chrome.runtime.openOptionsPage();
    //       },
    //     },
    //     position: 'top-right',
    //   });
    // }

    throw new Error(message);
  }
};

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
      await domainConfigStorage.togglePushingState(domain, false);
      if (res.success) {
        callback({ isOk: true, msg: 'Pushed success' });
      } else {
        console.log('json.errors[0]', res.errors[0]);
        callback({ isOk: false, msg: 'Pushed fail, please try again ', result: res });
      }
    } else {
      callback({ isOk: false, msg: 'no cookies found', result: cookies });
    }
  } catch (err) {
    callback({ isOk: false, msg: (err as Error).message || 'push fail, please try again ', result: err });
  } finally {
    await domainConfigStorage.togglePushingState(domain, false);
  }
};

const handlePull = async (activeTabUrl: string, domain: string, callback: HandleCallback) => {
  try {
    await check();
    await domainConfigStorage.togglePullingState(domain, true);
    const cookieMap = await pullAndSetCookies(activeTabUrl, domain);
    callback({ isOk: true, msg: 'Pull success', result: cookieMap });
  } catch (err) {
    callback({ isOk: false, msg: (err as Error).message || 'pull fail, please try again ', result: err });
  } finally {
    await domainConfigStorage.togglePullingState(domain, false);
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
        handlePull(activeTabUrl!, message.payload.domain, callback);
        break;

      default:
        break;
    }
    return true;
  }
  chrome.runtime.onMessage.addListener(handleMessage);
};
