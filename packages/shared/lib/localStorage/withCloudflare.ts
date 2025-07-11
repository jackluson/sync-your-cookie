import { cloudflareStorage, type AccountInfo } from '@sync-your-cookie/storage/lib/cloudflareStorage';
import { settingsStorage } from '@sync-your-cookie/storage/lib/settingsStorage';

import { WriteResponse } from '../cloudflare/api';
import { readLocalStorageCloudflareKV, writeLocalStorageCloudflareKV } from './api';

import { MessageErrorCode } from '../message';
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  decodeLocalStorageMap,
  encodeLocalStorageMap,
  ILocalStorageItem,
  ILocalStorageMap,
} from '@sync-your-cookie/protobuf';

export const checkLocalStorage = (accountInfo?: AccountInfo) => {
  const cloudflareAccountInfo = accountInfo || cloudflareStorage.getSnapshot();
  if (!cloudflareAccountInfo?.accountId || !cloudflareAccountInfo.namespaceId || !cloudflareAccountInfo.token) {
    let message = 'Account ID is empty';
    if (!cloudflareAccountInfo?.namespaceId) {
      message = 'NamespaceId ID is empty';
    } else if (!cloudflareAccountInfo.token) {
      message = 'Token is empty';
    }

    return Promise.reject({
      message,
      code: MessageErrorCode.AccountCheck,
    });
  }
  return cloudflareAccountInfo;
};

export const readLocalStorageMap = async (cloudflareAccountInfo: AccountInfo): Promise<ILocalStorageMap> => {
  await checkLocalStorage(cloudflareAccountInfo);
  const res = await readLocalStorageCloudflareKV(
    cloudflareAccountInfo.accountId!,
    cloudflareAccountInfo.namespaceId!,
    cloudflareAccountInfo.token!,
  );
  if (res) {
    try {
      const protobufEncoding = settingsStorage.getSnapshot()?.protobufEncoding;
      if (protobufEncoding) {
        const compressedBuffer = base64ToArrayBuffer(res);
        const deMsg = await decodeLocalStorageMap(compressedBuffer);
        return deMsg;
      } else {
        return JSON.parse(res);
      }
    } catch (error) {
      console.log('decode error', error);
      return {};
    }
  } else {
    return {};
  }
};

export const writeLocalStorageMap = async (cloudflareAccountInfo: AccountInfo, localStorageMap: ILocalStorageMap = {}) => {
  const protobufEncoding = settingsStorage.getSnapshot()?.protobufEncoding;
  let encodingStr = '';
  if (protobufEncoding) {
    const buffered = await encodeLocalStorageMap(localStorageMap);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    encodingStr = arrayBufferToBase64(buffered as any);
  } else {
    encodingStr = JSON.stringify(localStorageMap);
    console.log('localStorageMap', localStorageMap);
  }
  const res = await writeLocalStorageCloudflareKV(
    encodingStr,
    cloudflareAccountInfo.accountId!,
    cloudflareAccountInfo.namespaceId!,
    cloudflareAccountInfo.token!,
  );
  return res;
};

export const mergeAndWriteLocalStorage = async (
  cloudflareAccountInfo: AccountInfo,
  domain: string,
  items: ILocalStorageItem[],
  oldLocalStorageMap: ILocalStorageMap = {},
): Promise<[WriteResponse, ILocalStorageMap]> => {
  await checkLocalStorage(cloudflareAccountInfo);
  const localStorageMap: ILocalStorageMap = {
    updateTime: Date.now(),
    createTime: oldLocalStorageMap?.createTime || Date.now(),
    domainLocalStorageMap: {
      ...(oldLocalStorageMap.domainLocalStorageMap || {}),
      [domain]: {
        updateTime: Date.now(),
        createTime: oldLocalStorageMap.domainLocalStorageMap?.[domain]?.createTime || Date.now(),
        items: items,
      },
    },
  };

  const res = await writeLocalStorageMap(cloudflareAccountInfo, localStorageMap);
  return [res, localStorageMap];
};

export const mergeAndWriteMultipleDomainLocalStorage = async (
  cloudflareAccountInfo: AccountInfo,
  domainItems: { domain: string; items: ILocalStorageItem[] }[],
  oldLocalStorageMap: ILocalStorageMap = {},
): Promise<[WriteResponse, ILocalStorageMap]> => {
  await checkLocalStorage(cloudflareAccountInfo);

  const newDomainLocalStorageMap = {
    ...(oldLocalStorageMap.domainLocalStorageMap || {}),
  };
  for (const { domain, items } of domainItems) {
    newDomainLocalStorageMap[domain] = {
      updateTime: Date.now(),
      createTime: oldLocalStorageMap.domainLocalStorageMap?.[domain]?.createTime || Date.now(),
      items: items,
    };
  }
  const localStorageMap: ILocalStorageMap = {
    updateTime: Date.now(),
    createTime: oldLocalStorageMap?.createTime || Date.now(),
    domainLocalStorageMap: newDomainLocalStorageMap,
  };

  const res = await writeLocalStorageMap(cloudflareAccountInfo, localStorageMap);
  return [res, localStorageMap];
};

export const removeAndWriteLocalStorage = async (
  cloudflareAccountInfo: AccountInfo,
  domain: string,
  oldLocalStorageMap: ILocalStorageMap = {},
  key?: string,
): Promise<[WriteResponse, ILocalStorageMap]> => {
  await checkLocalStorage(cloudflareAccountInfo);
  const localStorageMap: ILocalStorageMap = {
    updateTime: Date.now(),
    createTime: oldLocalStorageMap?.createTime || Date.now(),
    domainLocalStorageMap: {
      ...(oldLocalStorageMap.domainLocalStorageMap || {}),
    },
  };
  if (localStorageMap.domainLocalStorageMap) {
    if (key !== undefined) {
      if (localStorageMap.domainLocalStorageMap[domain]?.items) {
        const oldLength = localStorageMap.domainLocalStorageMap[domain]?.items?.length || 0;
        localStorageMap.domainLocalStorageMap[domain].items =
          localStorageMap.domainLocalStorageMap[domain].items?.filter(
            (item: ILocalStorageItem) => item.key !== key,
          ) || [];
        const newLength = localStorageMap.domainLocalStorageMap[domain]?.items?.length || 0;
        if (oldLength === newLength) {
          throw new Error(`${key}: localStorage item not found`);
        }
      }
    } else {
      delete localStorageMap.domainLocalStorageMap[domain];
    }
  }

  const res = await writeLocalStorageMap(cloudflareAccountInfo, localStorageMap);
  return [res, localStorageMap];
};

export const editAndWriteLocalStorage = async (
  cloudflareAccountInfo: AccountInfo,
  host: string,
  oldLocalStorageMap: ILocalStorageMap = {},
  oldItem: ILocalStorageItem,
  newItem: ILocalStorageItem,
): Promise<[WriteResponse, ILocalStorageMap]> => {
  await checkLocalStorage(cloudflareAccountInfo);
  const localStorageMap: ILocalStorageMap = {
    updateTime: Date.now(),
    createTime: oldLocalStorageMap?.createTime || Date.now(),
    domainLocalStorageMap: {
      ...(oldLocalStorageMap.domainLocalStorageMap || {}),
    },
  };
  if (localStorageMap.domainLocalStorageMap) {
    const itemLength = localStorageMap.domainLocalStorageMap[host]?.items?.length || 0;
    for (let i = 0; i < itemLength; i++) {
      const localStorageItem = localStorageMap.domainLocalStorageMap[host]?.items?.[i];
      if (localStorageItem?.key === oldItem.key) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (localStorageMap.domainLocalStorageMap[host].items as any)[i] = {
          ...localStorageItem,
          ...newItem,
        };
        break;
      }
    }
  }

  const res = await writeLocalStorageMap(cloudflareAccountInfo, localStorageMap);
  return [res, localStorageMap];
};