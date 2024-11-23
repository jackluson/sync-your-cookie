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
  const compressedBuffer = base64ToArrayBuffer(res);
  const deMsg = await decodeCookiesMap(compressedBuffer);
  return deMsg;
};

export const writeCookiesMap = async (cloudflareAccountInfo: AccountInfo, cookiesMap: ICookiesMap = {}) => {
  const buffered = await encodeCookiesMap(cookiesMap);
  const base64Str = arrayBufferToBase64(buffered);
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
    console.log('domain, cookies', domain, cookies);
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
  name?: string,
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
    if (name !== undefined) {
      if (cookiesMap.domainCookieMap[domain]?.cookies) {
        cookiesMap.domainCookieMap[domain].cookies =
          cookiesMap.domainCookieMap[domain].cookies?.filter(cookie => cookie.name !== name) || [];
      }
    } else {
      delete cookiesMap.domainCookieMap[domain];
    }
  }

  const res = await writeCookiesMap(cloudflareAccountInfo, cookiesMap);
  return [res, cookiesMap];
};
