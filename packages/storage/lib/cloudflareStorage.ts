import { BaseStorage, createStorage, StorageType } from './base';

export interface AccountInfo {
  accountId?: string;
  namespaceId?: string;
  token?: string;
}

const storage = createStorage<AccountInfo>(
  'cloudflare-account',
  {},
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

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
