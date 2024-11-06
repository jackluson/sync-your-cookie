import { BaseStorage, createStorage, StorageType } from './base';

export interface AccountInfo {
  accountId?: string;
  namespaceId?: string;
  token?: string;
}
const key = 'cloudflare-account-storage-key';
const cacheStorageMap = new Map();

const initStorage = (): BaseStorage<AccountInfo> => {
  if (cacheStorageMap.has(key)) {
    return cacheStorageMap.get(key);
  }
  const storage = createStorage<AccountInfo>(
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

type CloudflareStorage = BaseStorage<AccountInfo> & {
  update: (updateInfo: AccountInfo) => Promise<void>;
};

export const cloudflareStorage: CloudflareStorage = {
  ...storage,
  update: async (updateInfo: AccountInfo) => {
    await storage.set(currentInfo => {
      return { ...currentInfo, ...updateInfo };
    });
  },
};
