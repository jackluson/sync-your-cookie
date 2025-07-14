chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, payload } = message;

  switch (type) {
    case 'GET_LOCAL_STORAGE':
      try {
        console.log('Content script: Getting localStorage data');
        const data = { ...window.localStorage };
        console.log('Content script: localStorage data:', data);
        sendResponse({ isOk: true, data });
      } catch (e) {
        console.error('Content script: Error getting localStorage:', e);
        sendResponse({ isOk: false, error: e.message });
      }
      break;

    case 'SET_LOCAL_STORAGE':
      try {
        window.localStorage.clear();
        for (const key in payload.data) {
          if (Object.prototype.hasOwnProperty.call(payload.data, key)) {
            window.localStorage.setItem(key, payload.data[key]);
          }
        }
        sendResponse({ isOk: true });
      } catch (e) {
        sendResponse({ isOk: false, error: e.message });
      }
      break;

    case 'REMOVE_LOCAL_STORAGE_ITEM':
      try {
        if (payload.key) {
          window.localStorage.removeItem(payload.key);
        } else {
          window.localStorage.clear();
        }
        sendResponse({ isOk: true });
      } catch (e) {
        sendResponse({ isOk: false, error: e.message });
      }
      break;

    case 'SET_LOCAL_STORAGE_ITEM':
      try {
        window.localStorage.setItem(payload.key, payload.value);
        sendResponse({ isOk: true });
      } catch (e) {
        sendResponse({ isOk: false, error: e.message });
      }
      break;
  }
  
  return true;
});