import { createStorage, StorageType } from './base';

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

const storage = createStorage<DomainConfig>(
  'domainConfig-storage-key',
  {
    pulling: false,
    pushing: false,
    domainMap: {},
  },
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

export const domainConfigStorage = {
  ...storage,
  resetState: async () => {
    return await storage.set(currentInfo => {
      const domainMap = currentInfo?.domainMap || {};
      for (const domain in domainMap) {
        domainMap[domain] = {
          ...domainMap[domain],
          pulling: false,
          pushing: false,
        };
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
      console.log('currentInfo', currentInfo);
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
