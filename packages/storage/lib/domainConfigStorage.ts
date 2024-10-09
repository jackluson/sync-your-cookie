import { BaseStorage, createStorage, StorageType } from './base';

type DomainItemConfig = {
  autoPull?: boolean;
  autoPush?: boolean;
};

interface DomainConfig {
  pulling: boolean;
  pushing: boolean;
  domainMap: {
    [domain: string]: DomainItemConfig;
  };
}

type DomainConfigStorage = BaseStorage<DomainConfig> & {
  update: (updateInfo: Partial<DomainConfig>) => Promise<void>;
  updateItem: (domain: string, updateConf: DomainItemConfig) => Promise<void>;
};

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

export const domainConfigStorage: DomainConfigStorage = {
  ...storage,
  updateItem: async (domain: string, updateConf: DomainItemConfig) => {
    await storage.set(currentInfo => {
      const domainMap = currentInfo.domainMap || {};
      domainMap[domain] = {
        ...domainMap[domain],
        ...updateConf,
      };
      return { ...currentInfo, domainMap };
    });
  },
  update: async (updateInfo: Partial<DomainConfig>) => {
    await storage.set(currentInfo => {
      return { ...currentInfo, ...updateInfo };
    });
  },
};
