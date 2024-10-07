// sort-imports-ignore
import 'webextension-polyfill';

import { cloudflareStorage, cookieStorage } from '@sync-your-cookie/storage';

import { readAndDecodeCookies } from '@sync-your-cookie/shared';

function badge(text: string, color: string = '#7246e4', delay?: number) {
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
  if (delay) {
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '' });
    }, delay);
  }
}

const init = async () => {
  badge('↓');
  const cloudflareInfo = await cloudflareStorage.get();
  console.log('cloudflareInfo-->bg', cloudflareInfo);
  const cookieMap = await readAndDecodeCookies(cloudflareInfo);
  console.log('bg-> cookieMap', cookieMap);
  cookieStorage.update(cookieMap);
  badge('');
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
    if (info.menuItemId === 'openSidePanel') {
      // This will open the panel in all the pages on the current window.
      chrome.sidePanel.open({ windowId: tab.windowId });
    }
  });
});
