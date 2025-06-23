import { cloudflareStorage, type AccountInfo } from '@sync-your-cookie/storage/lib/cloudflareStorage';

import { readCloudflareKV, writeCloudflareKV, WriteResponse } from '../cloudflare/api';

import { MessageErrorCode } from '@lib/message';
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  decodeCookiesMap,
  encodeCookiesMap,
  ICookie,
  ICookiesMap,
} from '@sync-your-cookie/protobuf';

export const check = (accountInfo?: AccountInfo) => {
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

export const readCookiesMap = async (cloudflareAccountInfo: AccountInfo): Promise<ICookiesMap> => {
  await check(cloudflareAccountInfo);
  const res = await readCloudflareKV(
    cloudflareAccountInfo.accountId!,
    cloudflareAccountInfo.namespaceId!,
    cloudflareAccountInfo.token!,
  );
  if (res) {
    const compressedBuffer = base64ToArrayBuffer(res);
    const deMsg = await decodeCookiesMap(compressedBuffer);
    return deMsg;
  } else {
    return {};
  }
};

export const writeCookiesMap = async (cloudflareAccountInfo: AccountInfo, cookiesMap: ICookiesMap = {}) => {
  const buffered = await encodeCookiesMap(cookiesMap);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const base64Str = arrayBufferToBase64(buffered as any);
  const res = await writeCloudflareKV(
    base64Str,
    cloudflareAccountInfo.accountId!,
    cloudflareAccountInfo.namespaceId!,
    cloudflareAccountInfo.token!,
  );
  return res;
};

export const mergeAndWriteCookies = async (
  cloudflareAccountInfo: AccountInfo,
  domain: string,
  cookies: ICookie[],
  oldCookieMap: ICookiesMap = {},
): Promise<[WriteResponse, ICookiesMap]> => {
  await check(cloudflareAccountInfo);
  const cookiesMap: ICookiesMap = {
    updateTime: Date.now(),
    createTime: oldCookieMap?.createTime || Date.now(),
    domainCookieMap: {
      ...(oldCookieMap.domainCookieMap || {}),
      [domain]: {
        updateTime: Date.now(),
        createTime: oldCookieMap.domainCookieMap?.[domain]?.createTime || Date.now(),
        cookies: cookies,
      },
    },
  };

  const res = await writeCookiesMap(cloudflareAccountInfo, cookiesMap);
  return [res, cookiesMap];
};

export const mergeAndWriteMultipleDomainCookies = async (
  cloudflareAccountInfo: AccountInfo,
  domainCookies: { domain: string; cookies: ICookie[] }[],
  oldCookieMap: ICookiesMap = {},
): Promise<[WriteResponse, ICookiesMap]> => {
  await check(cloudflareAccountInfo);

  const newDomainCookieMap = {
    ...(oldCookieMap.domainCookieMap || {}),
  };
  for (const { domain, cookies } of domainCookies) {
    newDomainCookieMap[domain] = {
      updateTime: Date.now(),
      createTime: oldCookieMap.domainCookieMap?.[domain]?.createTime || Date.now(),
      cookies: cookies,
    };
  }
  const cookiesMap: ICookiesMap = {
    updateTime: Date.now(),
    createTime: oldCookieMap?.createTime || Date.now(),
    domainCookieMap: newDomainCookieMap,
  };

  const res = await writeCookiesMap(cloudflareAccountInfo, cookiesMap);
  return [res, cookiesMap];
};

export const removeAndWriteCookies = async (
  cloudflareAccountInfo: AccountInfo,
  domain: string,
  oldCookieMap: ICookiesMap = {},
  id?: string,
): Promise<[WriteResponse, ICookiesMap]> => {
  await check(cloudflareAccountInfo);
  const cookiesMap: ICookiesMap = {
    updateTime: Date.now(),
    createTime: oldCookieMap?.createTime || Date.now(),
    domainCookieMap: {
      ...(oldCookieMap.domainCookieMap || {}),
    },
  };
  if (cookiesMap.domainCookieMap) {
    if (id !== undefined) {
      if (cookiesMap.domainCookieMap[domain]?.cookies) {
        const oldLength = cookiesMap.domainCookieMap[domain]?.cookies?.length || 0;
        cookiesMap.domainCookieMap[domain].cookies =
          cookiesMap.domainCookieMap[domain].cookies?.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (cookie: any) => `${cookie.domain}_${cookie.name}` !== id,
          ) || [];
        const newLength = cookiesMap.domainCookieMap[domain]?.cookies?.length || 0;
        if (oldLength === newLength) {
          throw new Error(`${id}: cookie not found`);
        }
      }
    } else {
      delete cookiesMap.domainCookieMap[domain];
    }
  }

  const res = await writeCookiesMap(cloudflareAccountInfo, cookiesMap);
  return [res, cookiesMap];
};

export const editAndWriteCookies = async (
  cloudflareAccountInfo: AccountInfo,
  host: string,
  oldCookieMap: ICookiesMap = {},
  oldItem: ICookie,
  newItem: ICookie,
): Promise<[WriteResponse, ICookiesMap]> => {
  await check(cloudflareAccountInfo);
  const cookiesMap: ICookiesMap = {
    updateTime: Date.now(),
    createTime: oldCookieMap?.createTime || Date.now(),
    domainCookieMap: {
      ...(oldCookieMap.domainCookieMap || {}),
    },
  };
  if (cookiesMap.domainCookieMap) {
    const cookieLength = cookiesMap.domainCookieMap[host]?.cookies?.length || 0;
    for (let i = 0; i < cookieLength; i++) {
      const cookieItem = cookiesMap.domainCookieMap[host]?.cookies?.[i];
      if (cookieItem?.name === oldItem.name && cookieItem?.domain === oldItem.domain) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (cookiesMap.domainCookieMap[host].cookies as any)[i] = {
          ...cookieItem,
          ...newItem,
        };
        break;
      }
    }
  }

  const res = await writeCookiesMap(cloudflareAccountInfo, cookiesMap);
  return [res, cookiesMap];
};
