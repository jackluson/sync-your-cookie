import 'webextension-polyfill';
import { themeStorage } from '@sync-your-cookie/storage';

themeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('background loaded');
console.log("Edit 'apps/chrome-extension/lib/background/index.ts' and save to reload.");
