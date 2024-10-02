import { BaseStorage, createStorage, StorageType } from './base';

export const cloudflareAccoutIdStorage: BaseStorage<string> = createStorage<string>('cloudflare-account-id', 'x', {
  storageType: StorageType.Local,
  liveUpdate: true,
});
