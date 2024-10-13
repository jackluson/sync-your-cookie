export function setBadge(text: string, color: string = '#7246e4') {
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
}

export function clearBadge() {
  chrome.action.setBadgeText({ text: '' });
}

export function setPullingBadge() {
  setBadge('↓');
}

export function setPushingBadge() {
  setBadge('↑');
}

export function setPushingAndPullingBadge() {
  // badge('↓↑');
  setBadge('⇅');
}
