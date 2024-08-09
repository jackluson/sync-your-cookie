import { BaseStorage, createStorage, StorageType } from './base';

type Theme = 'light' | 'dark' | 'system';

type ThemeStorage = BaseStorage<Theme> & {
  toggle: () => Promise<void>;
};

const storage = createStorage<Theme>('theme-storage-key', 'light', {
  storageType: StorageType.Local,
  liveUpdate: true,
});

export const themeStorage: ThemeStorage = {
  ...storage,
  // TODO: extends your own methods
  toggle: async () => {
    await storage.set(currentTheme => {
      return currentTheme === 'light' ? 'dark' : 'light';
    });
  },
};
