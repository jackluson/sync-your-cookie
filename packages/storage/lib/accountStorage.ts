import { BaseStorage, createStorage, StorageType } from './base';

export interface AccountInfo {
  accountId?: string;
  namespaceId?: string;
  token?: string;
  githubAccessToken?: string;
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
      storageType: StorageType.Sync,
      liveUpdate: true,
    },
  );
  cacheStorageMap.set(key, storage);
  return storage;
};

const storage = initStorage();

type AccountInfoStorage = BaseStorage<AccountInfo> & {
  update: (updateInfo: AccountInfo) => Promise<void>;
};

export const accountStorage: AccountInfoStorage = {
  ...storage,
  update: async (updateInfo: AccountInfo) => {
    await storage.set(currentInfo => {
      return { ...currentInfo, ...updateInfo };
    });
  },
};
