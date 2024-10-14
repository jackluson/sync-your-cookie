// sort-imports-ignore
import 'webextension-polyfill';

import { pullAndSetCookies, pullCookies, pushMultipleDomainCookies } from '@sync-your-cookie/shared';
import { domainConfigStorage } from '@sync-your-cookie/storage';
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
    title: 'Open Cookie Manager',
    contexts: ['all'],
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'openSidePanel' && tab?.windowId) {
      // This will open the panel in all the pages on the current window.
      chrome.sidePanel.open({ windowId: tab.windowId });
    }
  });
});

let changeTimer: NodeJS.Timeout | null = null;
const changedDomainSet = new Set<string>();
chrome.cookies.onChanged.addListener(changeInfo => {
  changeTimer && clearTimeout(changeTimer);
  changedDomainSet.add(changeInfo.cookie.domain);
  changeTimer = setTimeout(async () => {
    const domainConfig = await domainConfigStorage.get();
    const pushDomainSet = new Set<string>();
    for (const domain of changedDomainSet) {
      for (const key in domainConfig.domainMap) {
        if (domain.endsWith(key) && domainConfig.domainMap[key]?.autoPush) {
          pushDomainSet.add(key);
        }
      }
    }

    const uploadDomainCookies = [];
    for (const domain of pushDomainSet) {
      const cookies = await chrome.cookies.getAll({
        domain: domain,
      });
      uploadDomainCookies.push({
        domain,
        cookies,
      });
    }
    if (uploadDomainCookies.length) {
      await pushMultipleDomainCookies(uploadDomainCookies);
    }
    changedDomainSet.clear();
  }, 15000);
});

let previousActiveTabList: chrome.tabs.Tab[] = [];

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  // 1. current tab not exist in the tabMap
  // read changeInfo data and do something with it (like read the url)
  console.log('tab', tab);
  if (changeInfo.status === 'loading' && changeInfo.url) {
    const domainConfig = await domainConfigStorage.get();
    let pullDomain = '';
    let needPull = false;
    for (const key in domainConfig.domainMap) {
      if (new URL(changeInfo.url).host.endsWith(key) && domainConfig.domainMap[key]?.autoPull) {
        needPull = true;
        pullDomain = key;
        break;
        // await pullCookies();
      }
    }
    if (needPull) {
      const allOpendTabs = await chrome.tabs.query({});
      const otherExistedTabs = allOpendTabs.filter(itemTab => tab.id !== itemTab.id);
      console.log('otherExistedTabs', otherExistedTabs);
      for (const itemTab of otherExistedTabs) {
        if (itemTab.url && new URL(itemTab.url).host === new URL(changeInfo.url).host) {
          needPull = false;
          break;
        }
      }
    }

    if (needPull) {
      console.log('previousActiveTabList', previousActiveTabList);
      for (const itemTab of previousActiveTabList) {
        if (itemTab.url && new URL(itemTab.url).host === new URL(changeInfo.url).host) {
          needPull = false;
          break;
        }
      }
    }
    if (needPull) {
      console.log('need to pullCookies', changeInfo);
      await pullAndSetCookies(changeInfo.url, pullDomain);
    }
    const allActiveTabs = await chrome.tabs.query({
      active: true,
    });
    previousActiveTabList = allActiveTabs;
  }
});

// let previousUrl = '';
// chrome.webNavigation?.onBeforeNavigate.addListener(function (object) {
//   chrome.tabs.get(object.tabId, function (tab) {
//     previousUrl = tab.url || '';
//     console.log('previousUrl', previousUrl);
//   });
// });

// chrome.tabs.onRemoved.addListener(async function (tabId, removeInfo) {
//   const allActiveTabs = await chrome.tabs.query({
//     active: true,
//   });
//   previousActiveTabList = allActiveTabs;
// });

chrome.tabs.onActivated.addListener(async function () {
  const allActiveTabs = await chrome.tabs.query({
    active: true,
  });
  previousActiveTabList = allActiveTabs;
});
