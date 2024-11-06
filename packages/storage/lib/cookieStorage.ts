import { ICookie, ICookiesMap } from '@sync-your-cookie/protobuf';
import { BaseStorage, createStorage, StorageType } from './base';

export interface Cookie extends ICookiesMap {}

const cacheStorageMap = new Map();
const key = 'cookie-storage-key';

const initStorage = (): BaseStorage<Cookie> => {
  if (cacheStorageMap.has(key)) {
    return cacheStorageMap.get(key);
  }
  const storage: BaseStorage<Cookie> = createStorage<Cookie>(
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

export const cookieStorage = {
  ...storage,
  reset: async () => {
    await storage.set(() => {
      return {};
    });
  },
  updateItem: async (domain: string, updateCookies: ICookie[]) => {
    let newVal: Cookie = {};
    await storage.set(currentInfo => {
      const domainCookieMap = currentInfo.domainCookieMap || {};
      currentInfo.createTime = currentInfo.createTime || Date.now();
      currentInfo.updateTime = Date.now();
      domainCookieMap[domain] = {
        ...domainCookieMap[domain],
        cookies: updateCookies,
      };
      newVal = { ...currentInfo, domainCookieMap };
      return newVal;
    });
    return newVal;
  },
  update: async (updateInfo: Cookie, isInit = false) => {
    let newVal: Cookie = {};
    await storage.set(currentInfo => {
      newVal = isInit ? updateInfo : { ...currentInfo, ...updateInfo };
      return newVal;
    });
    return newVal;
  },
  removeItem: async (domain: string) => {
    let newVal: Cookie = {};
    await storage.set(currentInfo => {
      const domainCookieMap = currentInfo.domainCookieMap || {};
      delete domainCookieMap[domain];
      newVal = { ...currentInfo, domainCookieMap };
      return newVal;
    });
    return newVal;
  },
};
