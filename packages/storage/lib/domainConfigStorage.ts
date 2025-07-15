import { BaseStorage, createStorage, StorageType } from './base';

type DomainItemConfig = {
  autoPull?: boolean;
  autoPush?: boolean;
  favIconUrl?: string;
  sourceUrl?: string;
};

interface DomainConfig {
  domainMap: {
    [host: string]: DomainItemConfig;
  };
}
const key = 'domainConfig-storage-key';

const cacheStorageMap = new Map();
const initStorage = (): BaseStorage<DomainConfig> => {
  if (cacheStorageMap.has(key)) {
    return cacheStorageMap.get(key);
  }
  const storage: BaseStorage<DomainConfig> = createStorage<DomainConfig>(
    key,
    {
      domainMap: {},
    },
    {
      storageType: StorageType.Local,
      liveUpdate: true,
      // onLoad: onLoad,
    },
  );
  cacheStorageMap.set(key, storage);
  return storage;
};

const storage = initStorage();

export const domainConfigStorage = {
  ...storage,
  updateItem: async (host: string, updateConf: DomainItemConfig) => {
    return await storage.set(currentInfo => {
      const domainMap = currentInfo?.domainMap || {};
      domainMap[host] = {
        ...domainMap[host],
        ...updateConf,
      };
      return { ...(currentInfo || {}), domainMap };
    });
  },
  update: async (updateInfo: Partial<DomainConfig>) => {
    return await storage.set(currentInfo => {
      return { ...currentInfo, ...updateInfo };
    });
  },
  removeItem: async (domain: string) => {
    await storage.set(currentInfo => {
      const domainCookieMap = currentInfo.domainMap || {};
      delete domainCookieMap[domain];
      return { ...currentInfo, domainCookieMap };
    });
  },

  toggleAutoPullState: async (domain: string, checked?: boolean) => {
    return await storage.set(currentInfo => {
      const domainMap = currentInfo?.domainMap || {};
      domainMap[domain] = {
        ...domainMap[domain],
        autoPull: checked ?? !domainMap[domain]?.autoPull,
      };
      return { ...(currentInfo || {}), domainMap };
    });
  },

  toggleAutoPushState: async (domain: string, checked?: boolean) => {
    return await storage.set(currentInfo => {
      const domainMap = currentInfo?.domainMap || {};
      domainMap[domain] = {
        ...domainMap[domain],
        autoPush: checked ?? !domainMap[domain]?.autoPush,
      };
      return { ...(currentInfo || {}), domainMap };
    });
  },
};
