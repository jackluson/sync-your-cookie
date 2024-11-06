import { BaseStorage, createStorage, StorageType } from './base';

type Theme = 'light' | 'dark' | 'system';

type ThemeStorage = BaseStorage<Theme> & {
  toggle: () => Promise<void>;
};
const cacheStorageMap = new Map();
const key = 'theme-storage-key';

const initStorage = (): BaseStorage<Theme> => {
  if (cacheStorageMap.has(key)) {
    console.log('key', key);
    return cacheStorageMap.get(key);
  }
  const storage = createStorage<Theme>(key, 'light', {
    storageType: StorageType.Local,
    liveUpdate: true,
  });
  cacheStorageMap.set(key, storage);
  return storage;
};

const storage = initStorage();

export const themeStorage: ThemeStorage = {
  ...storage,
  toggle: async () => {
    await storage.set((currentTheme: string) => {
      return currentTheme === 'light' ? 'dark' : 'light';
    });
  },
};
