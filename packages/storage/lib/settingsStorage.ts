import { BaseStorage, createStorage, StorageType } from './base';
export interface IStorageItem {
  value: string;
  label: string;
  rawUrl?: string;
  [key: string]: unknown;
}

export interface ISettings {
  storageKeyList: IStorageItem[];
  storageKey?: string;
  storageKeyGistId?: string;
  gistHtmlUrl?: string;
  protobufEncoding?: boolean;
  includeLocalStorage?: boolean;
  localStorageGetting?: boolean;
  contextMenu?: boolean;
  encryptionEnabled?: boolean;
  encryptionPassword?: string;
}
const key = 'settings-storage-key';
const cacheStorageMap = new Map();
export const defaultKey = 'sync-your-cookie';

const initStorage = (): BaseStorage<ISettings> => {
  if (cacheStorageMap.has(key)) {
    return cacheStorageMap.get(key);
  }
  const storage = createStorage<ISettings>(
    key,
    {
      storageKeyList: [{ value: defaultKey, label: defaultKey }],
      storageKey: defaultKey,
      protobufEncoding: false,
      includeLocalStorage: true,
      contextMenu: false,
    },
    {
      storageType: StorageType.Sync,
      liveUpdate: true,
    },
  );
  cacheStorageMap.set(key, storage);
  return storage;
};

const storage = initStorage();

type TSettingsStorage = BaseStorage<ISettings> & {
  update: (updateInfo: Partial<ISettings>) => Promise<void>;
  addStorageKey: (key: string) => Promise<void>;
  removeStorageKey: (key: string) => Promise<void>;
  // getStorageKeyList: () => Promise<string[]>;
};

export const settingsStorage: TSettingsStorage = {
  ...storage,
  update: async (updateInfo: Partial<ISettings>) => {
    await storage.set(currentInfo => {
      return { ...currentInfo, ...updateInfo };
    });
  },

  addStorageKey: async (key: string) => {
    await storage.set(currentInfo => {
      const exists = currentInfo.storageKeyList.find(item => item.value === key);
      if (exists) {
        return currentInfo;
      }
      return {
        ...currentInfo,
        storageKeyList: [...currentInfo.storageKeyList, { value: key, label: key }],
      };
    });
  },

  removeStorageKey: async (key: string) => {
    await storage.set(currentInfo => {
      const exists = currentInfo.storageKeyList.find(item => item.value === key);
      if (!exists) {
        return currentInfo;
      }
      return {
        ...currentInfo,
        storageKeyList: currentInfo.storageKeyList.filter(item => item.value !== key),
      };
    });
  },
};

export const getActiveStorageItem = (): IStorageItem | undefined => {
  const snapshot = settingsStorage.getSnapshot();
  const storageKey = snapshot?.storageKey;
  return snapshot?.storageKeyList.find(item => item.value === storageKey);
};

export const initStorageKey = () => {
  settingsStorage.update({
    storageKeyList: [{ value: defaultKey, label: defaultKey }],
    storageKey: defaultKey,
  });
};
