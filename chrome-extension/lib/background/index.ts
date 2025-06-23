// sort-imports-ignore
import 'webextension-polyfill';

import {
  extractDomainAndPort,
  pullAndSetCookies,
  pullCookies,
  pushMultipleDomainCookies,
} from '@sync-your-cookie/shared';
import { domainConfigStorage } from '@sync-your-cookie/storage/lib/domainConfigStorage';
import { refreshListen } from './listen';
import { initSubscribe } from './subscribe';

const init = async () => {
  try {
    await refreshListen();
    console.log('initListen finish');
    await initSubscribe(); // await state reset finish
    console.log('initSubscribe finish');
    await pullCookies(true);
    console.log('init pullCookies finish');
  } catch (error) {
    console.log('init-->error', error);
  }
};

chrome.runtime.onInstalled.addListener(async () => {
  init();
  // chrome.sidePanel.setPanexlBehavior({ openPanelOnActionClick: false });
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

let delayTimer: NodeJS.Timeout | null = null;
let checkDelayTimer: NodeJS.Timeout | null = null;
let timeoutFlag = false;
const changedDomainSet = new Set<string>();
chrome.cookies.onChanged.addListener(async changeInfo => {
  const domainConfigSnapShot = await domainConfigStorage.getSnapshot();
  const domain = changeInfo.cookie.domain;
  const domainMap = domainConfigSnapShot?.domainMap || {};
  let flag = false;
  for (const key in domainMap) {
    if (domain.endsWith(key) && domainMap[key]?.autoPush) {
      flag = true;
      break;
    }
  }
  if (!flag) return;
  if (delayTimer && timeoutFlag) {
    return;
  }
  delayTimer && clearTimeout(delayTimer);
  changedDomainSet.add(domain);
  delayTimer = setTimeout(async () => {
    timeoutFlag = false;
    if (checkDelayTimer) {
      clearTimeout(checkDelayTimer);
    }
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
    for (const host of pushDomainSet) {
      const [domain] = await extractDomainAndPort(host);

      const cookies = await chrome.cookies.getAll({
        domain: domain,
      });
      uploadDomainCookies.push({
        domain: host,
        cookies,
      });
    }
    if (uploadDomainCookies.length) {
      await pushMultipleDomainCookies(uploadDomainCookies);
      changedDomainSet.clear();
    }
  }, 15000);

  if (!checkDelayTimer) {
    checkDelayTimer = setTimeout(() => {
      if (delayTimer) {
        console.info('checkDelayTimer timeout');
        timeoutFlag = true;
      }
      checkDelayTimer = null;
    }, 60000);
  }
});

let previousActiveTabList: chrome.tabs.Tab[] = [];

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  // 1. current tab not exist in the tabMap
  // read changeInfo data and do something with it (like read the url)
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
      for (const itemTab of otherExistedTabs) {
        if (itemTab.url && new URL(itemTab.url).host === new URL(changeInfo.url).host) {
          needPull = false;
          break;
        }
      }
    }

    if (needPull) {
      for (const itemTab of previousActiveTabList) {
        if (itemTab.url && new URL(itemTab.url).host === new URL(changeInfo.url).host) {
          needPull = false;
          break;
        }
      }
    }
    if (needPull) {
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
  refreshListen();
});
