import { BaseStorage, createStorage, StorageType } from './base';

export interface ISettings {
  storageKey?: string;
  protobufEncoding?: boolean;
}
const key = 'settings-storage-key';
const cacheStorageMap = new Map();
export const defaultKey = 'sync-your-cookie';

const initStorage = (): BaseStorage<ISettings> => {
  if (cacheStorageMap.has(key)) {
    return cacheStorageMap.get(key);
  }
  const storage = createStorage<ISettings>(
    key,
    {
      storageKey: defaultKey,
      protobufEncoding: true,
    },
    {
      storageType: StorageType.Local,
      liveUpdate: true,
    },
  );
  cacheStorageMap.set(key, storage);
  return storage;
};

const storage = initStorage();

type TSettingsStorage = BaseStorage<ISettings> & {
  update: (updateInfo: ISettings) => Promise<void>;
};

export const settingsStorage: TSettingsStorage = {
  ...storage,
  update: async (updateInfo: ISettings) => {
    await storage.set(currentInfo => {
      return { ...currentInfo, ...updateInfo };
    });
  },
};
