import type { AccountInfo } from '@sync-your-cookie/storage';
import { readCloudflareKV } from '../cloudflare/api';

import { base64ToArrayBuffer, decodeCookiesMap } from '@sync-your-cookie/protobuf';

export const readAndDecodeCookies = async (cloudflareAccountInfo: AccountInfo) => {
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
