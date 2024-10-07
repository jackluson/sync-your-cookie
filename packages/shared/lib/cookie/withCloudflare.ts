import type { AccountInfo } from '@sync-your-cookie/storage';
import { readCloudflareKV, writeCloudflareKV, WriteResponse } from '../cloudflare/api';

import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  decodeCookiesMap,
  encodeCookiesMap,
  ICookie,
  ICookiesMap,
} from '@sync-your-cookie/protobuf';

export const readCookiesMap = async (cloudflareAccountInfo: AccountInfo): Promise<ICookiesMap> => {
  if (!cloudflareAccountInfo.accountId || !cloudflareAccountInfo.namespaceId || !cloudflareAccountInfo.token) return {};
  const res = await readCloudflareKV(
    cloudflareAccountInfo.accountId,
    cloudflareAccountInfo.namespaceId,
    cloudflareAccountInfo.token,
  );
  console.log('res', res);
  const compressedBuffer = base64ToArrayBuffer(res);
  const deMsg = await decodeCookiesMap(compressedBuffer);
  console.log('deMsg', deMsg);
  // const cookies = deMsg.cookies;
  // let cookieDetails: ICookie[] = [];

  // cookieDetails = cookies.map(cookie => {
  //   return {
  //     domain: cookie.domain ?? undefined,
  //     expirationDate: cookie.expirationDate ?? undefined,
  //     httpOnly: cookie.httpOnly ?? undefined,
  //     name: cookie.name ?? undefined,
  //     // partitionKey: cookie.storeId,
  //     path: cookie.path ?? undefined,
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     sameSite: cookie.sameSite ?? ('lax' as any),
  //     secure: cookie.secure ?? undefined,
  //     storeId: cookie.storeId ?? undefined,
  //     value: cookie.value ?? undefined,
  //   };
  // });
  // console.log('pull cookiesDetail-》', cookieDetails);
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
  if (!cloudflareAccountInfo.accountId || !cloudflareAccountInfo.namespaceId || !cloudflareAccountInfo.token) {
    throw new Error('cloudflareAccountInfo is invalid');
  }
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
