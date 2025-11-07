let globalMenuId: number | string = '';

export const initContextMenu = () => {
  globalMenuId = chrome.contextMenus.create({
    id: 'openSidePanel',
    title: 'Open Cookie Manager',
    contexts: ['all'],
  });
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'openSidePanel' && tab?.windowId) {
      // This will open the panel in all the pages on the current window.
      console.log('openSidePanel->tab', tab);
      chrome.sidePanel.open({ windowId: tab.windowId });
    }
  });
};

export const removeContextMenu = () => {
  if (globalMenuId) {
    chrome.contextMenus.remove(globalMenuId);
  }
};
