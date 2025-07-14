import {
  check,
  checkLocalStorage,
  checkCloudflareResponse,
  CookieOperator,
  extractDomainAndPort,
  ICookie,
  ILocalStorageItem,
  Message,
  MessageType,
  pullAndSetCookies,
  PushCookieMessagePayload,
  PushLocalStorageMessagePayload,
  pushCookies,
  pushLocalStorage,
  LocalStorageOperator,
  pullLocalStorage,
  removeLocalStorage,
  removeLocalStorageItem,
  removeCookieItem,
  removeCookies,
  SendResponse,
  PushAllMessagePayload,
  PullAllMessagePayload,
} from '@sync-your-cookie/shared';

import { domainConfigStorage } from '@sync-your-cookie/storage/lib/domainConfigStorage';

type HandleCallback = (response?: SendResponse) => void;

const handlePush = async (payload: PushCookieMessagePayload, callback: HandleCallback) => {
  const { sourceUrl, host, favIconUrl } = payload || {};
  try {
    await check();
    await domainConfigStorage.updateItem(host, {
      pushing: true,
      sourceUrl: sourceUrl,
      favIconUrl,
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
    await domainConfigStorage.togglePushingState(host, false);
  }
};

const handlePull = async (activeTabUrl: string, domain: string, isReload: boolean, callback: HandleCallback) => {
  try {
    await check();
    await domainConfigStorage.togglePullingState(domain, true);
    const cookieMap = await pullAndSetCookies(activeTabUrl, domain, isReload);
    callback({ isOk: true, msg: 'Pull success', result: cookieMap });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    checkCloudflareResponse(err, 'pull', callback);
  } finally {
    await domainConfigStorage.togglePullingState(domain, false);
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

const handlePushLocalStorage = async (payload: PushLocalStorageMessagePayload, sender: chrome.runtime.MessageSender, callback: HandleCallback) => {
  const { sourceUrl, host, favIconUrl } = payload || {};
  try {
    await checkLocalStorage();
    await domainConfigStorage.updateItem(host, {
      pushing: true,
      sourceUrl: sourceUrl,
      favIconUrl,
    });
    const [domain] = await extractDomainAndPort(host);
    
    // Check if sender has a tab (message from content script vs popup/options)
    if (!sender.tab?.id) {
      // If no tab, we need to get the active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];
      
      if (!activeTab?.id) {
        callback({ isOk: false, msg: 'No active tab found' });
        return;
      }
      
      // Use active tab instead of sender tab
      sender.tab = activeTab;
    }
    
    // Add timeout and better error handling for content script communication
    const timeoutId = setTimeout(() => {
      callback({ isOk: false, msg: 'Content script communication timeout' });
    }, 5000);
    
    chrome.tabs.sendMessage(sender.tab.id!, { type: 'GET_LOCAL_STORAGE' }, async (response) => {
      clearTimeout(timeoutId);
      
      try {
        // Check for chrome.runtime.lastError
        if (chrome.runtime.lastError) {
          callback({ isOk: false, msg: `Content script error: ${chrome.runtime.lastError.message}` });
          return;
        }
        
        // Check if response is valid
        if (!response) {
          callback({ isOk: false, msg: 'No response from content script - possibly not loaded' });
          return;
        }
        
        if (response?.isOk) {
          const localStorageData = response.data;
          console.log('localStorage data received:', localStorageData);
          
          const items: ILocalStorageItem[] = Object.entries(localStorageData).map(([key, value]) => ({
            key,
            value: String(value),
          }));
          
          if (items.length > 0) {
            console.log('Pushing localStorage items:', items);
            const res = await pushLocalStorage(host, items);
            checkCloudflareResponse(res, 'push', callback);
          } else {
            callback({ isOk: false, msg: 'no localStorage items found', result: localStorageData });
          }
        } else {
          callback({ isOk: false, msg: 'Failed to get localStorage from page', result: response });
        }
      } catch (err: any) {
        console.error('handlePushLocalStorage error:', err);
        checkCloudflareResponse(err, 'push', callback);
      } finally {
        await domainConfigStorage.togglePushingState(host, false);
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('handlePushLocalStorage outer error:', err);
    checkCloudflareResponse(err, 'push', callback);
    await domainConfigStorage.togglePushingState(host, false);
  }
};

const handlePullLocalStorage = async (activeTabUrl: string, domain: string, isReload: boolean, sender: chrome.runtime.MessageSender, callback: HandleCallback) => {
  try {
    await checkLocalStorage();
    await domainConfigStorage.togglePullingState(domain, true);
    const localStorageMap = await pullLocalStorage();
    const domainData = localStorageMap.domainLocalStorageMap?.[domain];
    
    // Check if sender has a tab (message from content script vs popup/options)
    if (!sender.tab?.id) {
      // If no tab, we need to get the active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];
      
      if (!activeTab?.id) {
        callback({ isOk: false, msg: 'No active tab found' });
        return;
      }
      
      // Use active tab instead of sender tab
      sender.tab = activeTab;
    }
    
    if (domainData?.items && domainData.items.length > 0) {
      const localStorageData: Record<string, string> = {};
      domainData.items.forEach(item => {
        if (item.key && item.value) {
          localStorageData[item.key] = item.value;
        }
      });
      
      chrome.tabs.sendMessage(sender.tab.id!, { 
        type: 'SET_LOCAL_STORAGE', 
        payload: { data: localStorageData } 
      }, (response) => {
        if (response?.isOk) {
          callback({ isOk: true, msg: 'Pull localStorage success', result: localStorageMap });
          if (isReload) {
            chrome.tabs.reload(sender.tab!.id!);
          }
        } else {
          callback({ isOk: false, msg: 'Failed to set localStorage on page', result: response });
        }
      });
    } else {
      callback({ isOk: false, msg: `No localStorage data found for ${domain}` });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    checkCloudflareResponse(err, 'pull', callback);
  } finally {
    await domainConfigStorage.togglePullingState(domain, false);
  }
};

const handleRemoveLocalStorage = async (domain: string, callback: HandleCallback) => {
  try {
    await checkLocalStorage();
    const res = await removeLocalStorage(domain);
    if (res.success) {
      callback({ isOk: true, msg: 'Removed localStorage success' });
    } else {
      checkCloudflareResponse(res, 'remove', callback);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    checkCloudflareResponse(err, 'remove', callback);
  }
};

const handleRemoveLocalStorageItem = async (domain: string, key: string, callback: HandleCallback) => {
  try {
    await checkLocalStorage();
    const res = await removeLocalStorageItem(domain, key);
    if (res.success) {
      callback({ isOk: true, msg: 'Deleted localStorage item success' });
    } else {
      checkCloudflareResponse(res, 'delete', callback);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    checkCloudflareResponse(err, 'delete', callback);
  }
};

const handleEditLocalStorageItem = async (domain: string, oldItem: ILocalStorageItem, newItem: ILocalStorageItem, callback: HandleCallback) => {
  try {
    await checkLocalStorage();
    const res = await LocalStorageOperator.editLocalStorageItem(domain, oldItem, newItem);
    if (res.success) {
      callback({ isOk: true, msg: 'Edited localStorage item success' });
    } else {
      checkCloudflareResponse(res, 'edit', callback);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    checkCloudflareResponse(err, 'edit', callback);
  }
};

const handlePushAll = async (payload: PushAllMessagePayload, sender: chrome.runtime.MessageSender, callback: HandleCallback) => {
  const { sourceUrl, host, favIconUrl } = payload || {};
  console.log('handlePushAll called with:', { sourceUrl, host, favIconUrl });
  
  try {
    await check();
    await checkLocalStorage();
    await domainConfigStorage.updateItem(host, {
      pushing: true,
      sourceUrl: sourceUrl,
      favIconUrl,
    });
    const [domain] = await extractDomainAndPort(host);
    
    // Check if sender has a tab (message from content script vs popup/options)
    if (!sender.tab?.id) {
      // If no tab, we need to get the active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];
      
      if (!activeTab?.id) {
        callback({ isOk: false, msg: 'No active tab found' });
        return;
      }
      
      // Use active tab instead of sender tab
      sender.tab = activeTab;
    }
    
    const results = {
      cookies: { success: false, error: null as any },
      localStorage: { success: false, error: null as any }
    };
    
    // Push cookies
    try {
      const cookies = await chrome.cookies.getAll({ domain: domain });
      if (cookies?.length) {
        const cookieRes = await pushCookies(host, cookies);
        results.cookies.success = cookieRes.success;
        if (!cookieRes.success) {
          results.cookies.error = cookieRes;
        }
      }
    } catch (err) {
      console.error('Push cookies failed:', err);
      results.cookies.error = err;
    }
    
    // Push localStorage
    try {
      // Add timeout for content script communication
      const timeoutId = setTimeout(() => {
        results.localStorage.error = new Error('Content script communication timeout');
      }, 5000);
      
      chrome.tabs.sendMessage(sender.tab.id!, { type: 'GET_LOCAL_STORAGE' }, async (response) => {
        clearTimeout(timeoutId);
        
        try {
          if (chrome.runtime.lastError) {
            results.localStorage.error = new Error(chrome.runtime.lastError.message);
            return;
          }
          
          if (response?.isOk) {
            const localStorageData = response.data;
            const items: ILocalStorageItem[] = Object.entries(localStorageData).map(([key, value]) => ({
              key,
              value: String(value),
            }));
            
            if (items.length > 0) {
              const localStorageRes = await pushLocalStorage(host, items);
              results.localStorage.success = localStorageRes.success;
              if (!localStorageRes.success) {
                results.localStorage.error = localStorageRes;
              }
            }
          } else {
            results.localStorage.error = new Error('Failed to get localStorage from page');
          }
        } catch (err) {
          console.error('Push localStorage failed:', err);
          results.localStorage.error = err;
        }
        
        // Send final result
        const successCount = (results.cookies.success ? 1 : 0) + (results.localStorage.success ? 1 : 0);
        if (successCount === 2) {
          callback({ isOk: true, msg: 'Push all success (cookies + localStorage)' });
        } else if (successCount === 1) {
          const errors = [];
          if (!results.cookies.success) errors.push('cookies');
          if (!results.localStorage.success) errors.push('localStorage');
          callback({ isOk: false, msg: `Partial push success. Failed: ${errors.join(', ')}`, result: results });
        } else {
          callback({ isOk: false, msg: 'Push all failed', result: results });
        }
      });
    } catch (err) {
      console.error('Push localStorage setup failed:', err);
      results.localStorage.error = err;
      
      // If only cookies succeeded
      if (results.cookies.success) {
        callback({ isOk: false, msg: 'Partial push success. Failed: localStorage', result: results });
      } else {
        callback({ isOk: false, msg: 'Push all failed', result: results });
      }
    }
    
  } catch (err: any) {
    console.error('handlePushAll error:', err);
    checkCloudflareResponse(err, 'push', callback);
  } finally {
    await domainConfigStorage.togglePushingState(host, false);
  }
};

const handlePullAll = async (activeTabUrl: string, domain: string, isReload: boolean, sender: chrome.runtime.MessageSender, callback: HandleCallback) => {
  console.log('handlePullAll called with:', { activeTabUrl, domain, isReload });
  
  try {
    await check();
    await checkLocalStorage();
    await domainConfigStorage.togglePullingState(domain, true);
    
    // Check if sender has a tab (message from content script vs popup/options)
    if (!sender.tab?.id) {
      // If no tab, we need to get the active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];
      
      if (!activeTab?.id) {
        callback({ isOk: false, msg: 'No active tab found' });
        return;
      }
      
      // Use active tab instead of sender tab
      sender.tab = activeTab;
    }
    
    const results = {
      cookies: { success: false, error: null as any },
      localStorage: { success: false, error: null as any }
    };
    
    // Pull cookies
    try {
      const cookieMap = await pullAndSetCookies(activeTabUrl, domain, false); // Don't reload yet
      results.cookies.success = true;
    } catch (err) {
      console.error('Pull cookies failed:', err);
      results.cookies.error = err;
    }
    
    // Pull localStorage
    try {
      const localStorageMap = await pullLocalStorage();
      const domainData = localStorageMap.domainLocalStorageMap?.[domain];
      
      if (domainData?.items && domainData.items.length > 0) {
        const localStorageData: Record<string, string> = {};
        domainData.items.forEach(item => {
          if (item.key && item.value) {
            localStorageData[item.key] = item.value;
          }
        });
        
        chrome.tabs.sendMessage(sender.tab.id!, { 
          type: 'SET_LOCAL_STORAGE', 
          payload: { data: localStorageData } 
        }, (response) => {
          if (response?.isOk) {
            results.localStorage.success = true;
          } else {
            results.localStorage.error = new Error('Failed to set localStorage on page');
          }
          
          // Send final result and reload if needed
          const successCount = (results.cookies.success ? 1 : 0) + (results.localStorage.success ? 1 : 0);
          if (successCount === 2) {
            callback({ isOk: true, msg: 'Pull all success (cookies + localStorage)' });
            if (isReload) {
              chrome.tabs.reload(sender.tab!.id!);
            }
          } else if (successCount === 1) {
            const errors = [];
            if (!results.cookies.success) errors.push('cookies');
            if (!results.localStorage.success) errors.push('localStorage');
            callback({ isOk: false, msg: `Partial pull success. Failed: ${errors.join(', ')}`, result: results });
          } else {
            callback({ isOk: false, msg: 'Pull all failed', result: results });
          }
        });
      } else {
        results.localStorage.error = new Error(`No localStorage data found for ${domain}`);
        
        // If only cookies succeeded
        if (results.cookies.success) {
          callback({ isOk: false, msg: 'Partial pull success. Failed: localStorage', result: results });
          if (isReload) {
            chrome.tabs.reload(sender.tab!.id!);
          }
        } else {
          callback({ isOk: false, msg: 'Pull all failed', result: results });
        }
      }
    } catch (err) {
      console.error('Pull localStorage failed:', err);
      results.localStorage.error = err;
      
      // If only cookies succeeded
      if (results.cookies.success) {
        callback({ isOk: false, msg: 'Partial pull success. Failed: localStorage', result: results });
        if (isReload) {
          chrome.tabs.reload(sender.tab!.id!);
        }
      } else {
        callback({ isOk: false, msg: 'Pull all failed', result: results });
      }
    }
    
  } catch (err: any) {
    console.error('handlePullAll error:', err);
    checkCloudflareResponse(err, 'pull', callback);
  } finally {
    await domainConfigStorage.togglePullingState(domain, false);
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
    case MessageType.PushLocalStorage:
      handlePushLocalStorage(message.payload, sender, callback);
      break;
    case MessageType.PullLocalStorage:
      // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-non-null-asserted-optional-chain
      const localStorageActiveTabUrl = message.payload.activeTabUrl || sender.tab?.url!;
      handlePullLocalStorage(localStorageActiveTabUrl!, message.payload.domain, message.payload.reload, sender, callback);
      break;
    case MessageType.RemoveLocalStorage:
      handleRemoveLocalStorage(message.payload.domain, callback);
      break;
    case MessageType.RemoveLocalStorageItem:
      handleRemoveLocalStorageItem(message.payload.domain, message.payload.key, callback);
      break;
    case MessageType.EditLocalStorageItem:
      handleEditLocalStorageItem(message.payload.domain, message.payload.oldItem, message.payload.newItem, callback);
      break;
    case MessageType.PushAll:
      handlePushAll(message.payload, sender, callback);
      break;
    case MessageType.PullAll:
      // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-non-null-asserted-optional-chain
      const pullAllActiveTabUrl = message.payload.activeTabUrl || sender.tab?.url!;
      handlePullAll(pullAllActiveTabUrl!, message.payload.domain, message.payload.reload, sender, callback);
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
