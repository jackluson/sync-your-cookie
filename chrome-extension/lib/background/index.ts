// sort-imports-ignore
import 'webextension-polyfill';

import { pullCookies } from '@sync-your-cookie/shared';
import { initSubscribe } from './subscribe';

const init = async () => {
  await initSubscribe(); // await state reset finish
  await pullCookies(true);
};

chrome.runtime.onInstalled.addListener(async () => {
  init();
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: false });
  chrome.contextMenus.create({
    id: 'openSidePanel',
    title: 'Manage Pushed Cookies',
    contexts: ['all'],
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'openSidePanel' && tab?.windowId) {
      // This will open the panel in all the pages on the current window.
      chrome.sidePanel.open({ windowId: tab.windowId });
    }
  });
});
