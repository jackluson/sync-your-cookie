import { ILocalStorageItem, ILocalStorageMap } from '@sync-your-cookie/protobuf';
import { BaseStorage, createStorage, StorageType } from './base';

export interface LocalStorage extends ILocalStorageMap {}

const cacheStorageMap = new Map();
const key = 'local-storage-storage-key';

const initStorage = (): BaseStorage<LocalStorage> => {
  if (cacheStorageMap.has(key)) {
    return cacheStorageMap.get(key);
  }
  const storage: BaseStorage<LocalStorage> = createStorage<LocalStorage>(
    key,
    {},
    {
      storageType: StorageType.Local,
      liveUpdate: true,
    },
  );
  cacheStorageMap.set(key, storage);
  return storage;
};

const storage = initStorage();

export const localStorageStorage = {
  ...storage,
  reset: async () => {
    await storage.set(() => {
      return {};
    });
  },
  updateItem: async (domain: string, updateItems: ILocalStorageItem[]) => {
    let newVal: LocalStorage = {};
    await storage.set(currentInfo => {
      const domainLocalStorageMap = currentInfo.domainLocalStorageMap || {};
      currentInfo.createTime = currentInfo.createTime || Date.now();
      currentInfo.updateTime = Date.now();
      domainLocalStorageMap[domain] = {
        ...domainLocalStorageMap[domain],
        items: updateItems,
      };
      newVal = { ...currentInfo, domainLocalStorageMap };
      return newVal;
    });
    return newVal;
  },
  update: async (updateInfo: LocalStorage, isInit = false) => {
    let newVal: LocalStorage = {};
    await storage.set(currentInfo => {
      newVal = isInit ? updateInfo : { ...currentInfo, ...updateInfo };
      return newVal;
    });
    return newVal;
  },
  removeItem: async (domain: string) => {
    let newVal: LocalStorage = {};
    await storage.set(currentInfo => {
      const domainLocalStorageMap = currentInfo.domainLocalStorageMap || {};
      delete domainLocalStorageMap[domain];
      newVal = { ...currentInfo, domainLocalStorageMap };
      return newVal;
    });
    return newVal;
  },

  removeDomainItem: async (domain: string, key: string) => {
    let newVal: LocalStorage = {};
    await storage.set(currentInfo => {
      const domainLocalStorageMap = currentInfo.domainLocalStorageMap || {};
      const domainLocalStorage = domainLocalStorageMap[domain] || {};
      const items = domainLocalStorage.items || [];
      const newItems = items.filter(item => item.key !== key);
      domainLocalStorageMap[domain] = {
        ...domainLocalStorage,
        items: newItems,
      };
      newVal = { ...currentInfo, domainLocalStorageMap };
      return newVal;
    });
    return newVal;
  },
};