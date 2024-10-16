import { createStorage, StorageType } from './base';

type DomainItemConfig = {
  autoPull?: boolean;
  autoPush?: boolean;
  pulling?: boolean;
  pushing?: boolean;
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
      console.log('domainMap in resetState', domainMap);
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
};
