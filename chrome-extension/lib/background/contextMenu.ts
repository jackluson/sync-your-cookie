export const initContextMenu = () => {
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
}
