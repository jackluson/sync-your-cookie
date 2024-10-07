export function badge(text: string, color: string = '#7246e4', delay?: number) {
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
  if (delay) {
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '' });
    }, delay);
  }
}

export function clearBadge() {
  chrome.action.setBadgeText({ text: '' });
}

export function setPullingBadge() {
  badge('↓');
}

export function setPushingBadge() {
  badge('↑');
}

export function setPushingAndPullingBadge() {
  badge('↕');
}
