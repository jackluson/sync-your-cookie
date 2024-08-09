import { themeStorage } from '@chrome-extension-boilerplate/storage';

export async function toggleTheme() {
  console.log('initial theme:', await themeStorage.get());
  await themeStorage.toggle();
  console.log('toggled theme:', await themeStorage.get());
}
