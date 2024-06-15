import { BaseStorage, createStorage, StorageType } from './base';

export const cloudflareAccoutIdStore: BaseStorage<string> = createStorage<string>('cloudflare-account-id', 'x', {
  storageType: StorageType.Local,
  liveUpdate: true,
});

console.log('cloudflareAccoutIdStore', cloudflareAccoutIdStore.get());
