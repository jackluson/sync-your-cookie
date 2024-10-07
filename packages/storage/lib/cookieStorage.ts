import { ICookie, ICookiesMap } from '@sync-your-cookie/protobuf';
import { BaseStorage, createStorage, StorageType } from './base';

interface Cookie extends ICookiesMap {}

export const storage = createStorage<ICookiesMap>(
  'cookie-storage-key',
  {},
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

type CookieStorage = BaseStorage<Cookie> & {
  update: (updateInfo: Cookie) => Promise<void>;
  updateItem: (domain: string, updateInfo: ICookie[]) => Promise<void>;
};

export const cookieStorage: CookieStorage = {
  ...storage,
  updateItem: async (domain: string, updateCookies: ICookie[]) => {
    await storage.set(currentInfo => {
      const domainCookieMap = currentInfo.domainCookieMap || {};
      currentInfo.createTime = currentInfo.createTime || Date.now();
      currentInfo.updateTime = Date.now();
      domainCookieMap[domain] = {
        ...domainCookieMap[domain],
        cookies: updateCookies,
      };
      return { ...currentInfo, domainCookieMap };
    });
  },
  update: async (updateInfo: Cookie) => {
    await storage.set(currentInfo => {
      return { ...currentInfo, ...updateInfo };
    });
  },
};
