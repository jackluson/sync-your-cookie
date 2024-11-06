import { BaseStorage, createStorage, StorageType } from './base';

type DomainItemConfig = {
  autoPull?: boolean;
  autoPush?: boolean;
  pulling?: boolean;
  pushing?: boolean;
  favIconUrl?: string;
};

interface DomainConfig {
  pulling: boolean;
  pushing: boolean;
  domainMap: {
    [domain: string]: DomainItemConfig;
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
      pulling: false,
      pushing: false,
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
  resetState: async () => {
    return await storage.set(currentInfo => {
      const domainMap = currentInfo?.domainMap || {};
      for (const domain in domainMap) {
        if (domain) {
          domainMap[domain] = {
            ...domainMap[domain],
            pulling: false,
            pushing: false,
          };
        } else {
          delete domainMap[domain];
        }
      }
      const resetInfo = {
        pulling: false,
        pushing: false,
        domainMap: domainMap,
      };
      return resetInfo;
    });
  },
  updateItem: async (domain: string, updateConf: DomainItemConfig) => {
    return await storage.set(currentInfo => {
      const domainMap = currentInfo?.domainMap || {};
      domainMap[domain] = {
        ...domainMap[domain],
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

  togglePullingState: async (domain: string, checked?: boolean) => {
    return await storage.set(currentInfo => {
      const domainMap = currentInfo?.domainMap || {};
      domainMap[domain] = {
        ...domainMap[domain],
        pulling: checked ?? !domainMap[domain]?.pulling,
      };
      return { ...(currentInfo || {}), domainMap };
    });
  },

  togglePushingState: async (domain: string, checked?: boolean) => {
    return await storage.set(currentInfo => {
      console.log('currentInfo', currentInfo);
      const domainMap = currentInfo?.domainMap || {};
      domainMap[domain] = {
        ...domainMap[domain],
        pushing: checked ?? !domainMap[domain]?.pushing,
      };
      return { ...(currentInfo || {}), domainMap };
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
