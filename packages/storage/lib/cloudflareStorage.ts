import { BaseStorage, createStorage, StorageType } from './base';

export const cloudflareAccountIdStorage: BaseStorage<string> = createStorage<string>('cloudflare-account-id', '', {
  storageType: StorageType.Local,
  liveUpdate: true,
});

export const cloudflareNamespaceIdStorage: BaseStorage<string> = createStorage<string>('cloudflare-namespace-id', '', {
  storageType: StorageType.Local,
  liveUpdate: true,
});

export const cloudflareTokenStorage: BaseStorage<string> = createStorage<string>('cloudflare-toekn', '', {
  storageType: StorageType.Local,
  liveUpdate: true,
});
