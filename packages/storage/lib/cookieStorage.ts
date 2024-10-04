import { ICookie } from '@sync-your-cookie/protobuf';
import { BaseStorage, createStorage, StorageType } from './base';

interface Cookie {
  list: ICookie[];
}

export const storage = createStorage<Cookie>(
  'cookie-storage-key',
  {
    list: [],
  },
  {
    storageType: StorageType.Local,
    liveUpdate: true,
  },
);

type CookieStorage = BaseStorage<Cookie> & {
  update: (updateInfo: Cookie) => Promise<void>;
};

export const cookieStorage: CookieStorage = {
  ...storage,
  update: async (updateInfo: Cookie) => {
    await storage.set(currentInfo => {
      return { ...currentInfo, ...updateInfo };
    });
  },
};
