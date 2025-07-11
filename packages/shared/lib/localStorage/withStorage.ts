import { ILocalStorageItem } from '@sync-your-cookie/protobuf';
import { LocalStorage, localStorageStorage } from '@sync-your-cookie/storage/lib/localStorageStorage';
import { domainConfigStorage } from '@sync-your-cookie/storage/lib/domainConfigStorage';

import { AccountInfo, cloudflareStorage } from '@sync-your-cookie/storage/lib/cloudflareStorage';

import { WriteResponse } from '../cloudflare';
import {
  editAndWriteLocalStorage,
  mergeAndWriteLocalStorage,
  mergeAndWriteMultipleDomainLocalStorage,
  readLocalStorageMap,
  removeAndWriteLocalStorage,
} from './withCloudflare';

export const readLocalStorageMapWithStatus = async (cloudflareInfo: AccountInfo) => {
  let localStorageMap: LocalStorage | null = null;
  const domainConfig = await domainConfigStorage.get();
  if (domainConfig.pushing) {
    localStorageMap = await localStorageStorage.getSnapshot();
  }
  if (localStorageMap && Object.keys(localStorageMap.domainLocalStorageMap || {}).length > 0) {
    return localStorageMap;
  }
  return await readLocalStorageMap(cloudflareInfo);
};

export const pullLocalStorage = async (isInit = false): Promise<LocalStorage> => {
  const cloudflareInfo = await cloudflareStorage.get();
  if (isInit && (!cloudflareInfo.accountId || !cloudflareInfo.namespaceId || !cloudflareInfo.token)) {
    return {};
  }
  try {
    const domainConfig = await domainConfigStorage.get();
    if (domainConfig.pulling) {
      const localStorageMap = await localStorageStorage.getSnapshot();
      if (localStorageMap && Object.keys(localStorageMap.domainLocalStorageMap || {}).length > 0) {
        return localStorageMap;
      }
    }
    await domainConfigStorage.update({
      pulling: true,
    });
    const localStorageMap = await readLocalStorageMapWithStatus(cloudflareInfo);
    const res = await localStorageStorage.update(localStorageMap, isInit);
    return res;
  } catch (e) {
    console.error('pullLocalStorage fail', e);
    return Promise.reject(e);
  } finally {
    await domainConfigStorage.update({
      pulling: false,
    });
  }
};

export const pushLocalStorage = async (domain: string, items: ILocalStorageItem[]): Promise<WriteResponse> => {
  console.log('pushLocalStorage called with domain:', domain, 'items:', items);
  const cloudflareInfo = await cloudflareStorage.get();
  console.log('cloudflareInfo:', { 
    hasAccountId: !!cloudflareInfo.accountId, 
    hasNamespaceId: !!cloudflareInfo.namespaceId, 
    hasToken: !!cloudflareInfo.token 
  });
  
  try {
    const domainConfig = await domainConfigStorage.get();
    if (domainConfig.pushing) return Promise.reject('the localStorage is pushing');
    await domainConfigStorage.update({
      pushing: true,
    });
    
    console.log('Reading old localStorage map...');
    const oldLocalStorage = await readLocalStorageMapWithStatus(cloudflareInfo);
    console.log('Old localStorage map:', oldLocalStorage);
    
    console.log('Merging and writing localStorage...');
    const [res, localStorageMap] = await mergeAndWriteLocalStorage(cloudflareInfo, domain, items, oldLocalStorage);
    console.log('Cloudflare response:', res);

    if (res.success) {
      await localStorageStorage.update(localStorageMap);
      console.log('Successfully updated local storage');
    }
    return res;
  } catch (e) {
    console.error('pushLocalStorage fail err', e);
    return Promise.reject(e);
  } finally {
    await domainConfigStorage.update({
      pushing: false,
    });
  }
};

export const pushMultipleDomainLocalStorage = async (
  domainItems: { domain: string; items: ILocalStorageItem[] }[],
): Promise<WriteResponse> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    const domainConfig = await domainConfigStorage.get();
    if (domainConfig.pushing) return Promise.reject('localStorage is pushing');
    await domainConfigStorage.update({
      pushing: true,
    });
    const oldLocalStorage = await readLocalStorageMapWithStatus(cloudflareInfo);
    const [res, localStorageMap] = await mergeAndWriteMultipleDomainLocalStorage(cloudflareInfo, domainItems, oldLocalStorage);
    await domainConfigStorage.update({
      pushing: false,
    });
    if (res.success) {
      localStorageStorage.update(localStorageMap);
    }
    return res;
  } catch (e) {
    console.error('pushMultipleDomainLocalStorage fail err', e);
    await domainConfigStorage.update({
      pushing: false,
    });
    return Promise.reject(e);
  }
};

export const removeLocalStorage = async (domain: string): Promise<WriteResponse> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    const domainConfig = await domainConfigStorage.get();
    if (domainConfig.pushing) return Promise.reject('the localStorage is pushing');
    await domainConfigStorage.update({
      pushing: true,
    });
    const oldLocalStorage = await readLocalStorageMapWithStatus(cloudflareInfo);
    const [res, localStorageMap] = await removeAndWriteLocalStorage(cloudflareInfo, domain, oldLocalStorage);
    await domainConfigStorage.update({
      pushing: false,
    });
    if (res.success) {
      localStorageStorage.update(localStorageMap);
    }
    return res;
  } catch (e) {
    console.error('removeLocalStorage fail err', e);
    await domainConfigStorage.update({
      pushing: false,
    });
    return Promise.reject(e);
  }
};

export const removeLocalStorageItem = async (domain: string, key: string): Promise<WriteResponse> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    const domainConfig = await domainConfigStorage.get();
    if (domainConfig.pushing) return Promise.reject('the localStorage is pushing');
    await domainConfigStorage.update({
      pushing: true,
    });
    const oldLocalStorage = await readLocalStorageMapWithStatus(cloudflareInfo);
    const [res, localStorageMap] = await removeAndWriteLocalStorage(cloudflareInfo, domain, oldLocalStorage, key);
    await domainConfigStorage.update({
      pushing: false,
    });
    if (res.success) {
      localStorageStorage.update(localStorageMap);
    }
    return res;
  } catch (e) {
    console.error('removeLocalStorageItem fail err', e);
    await domainConfigStorage.update({
      pushing: false,
    });
    return Promise.reject(e);
  }
};

export class LocalStorageOperator {
  static async prepare() {
    const cloudflareInfo = await cloudflareStorage.get();
    const domainConfig = await domainConfigStorage.get();
    if (domainConfig.pushing) return Promise.reject('the localStorage is pushing');
    return { cloudflareInfo };
  }

  static async setPushing(open: boolean) {
    await domainConfigStorage.update({
      pushing: open,
    });
  }

  static async editLocalStorageItem(host: string, oldItem: ILocalStorageItem, newItem: ILocalStorageItem) {
    try {
      const { cloudflareInfo } = await this.prepare();
      await this.setPushing(true);
      const oldLocalStorage = await readLocalStorageMapWithStatus(cloudflareInfo);
      const [res, localStorageMap] = await editAndWriteLocalStorage(cloudflareInfo, host, oldLocalStorage, oldItem, newItem);
      await this.setPushing(false);

      if (res.success) {
        localStorageStorage.update(localStorageMap);
      }
      return res;
    } catch (e) {
      console.error('editLocalStorageItem fail err', e);
      await this.setPushing(false);
      return Promise.reject(e);
    }
  }
}