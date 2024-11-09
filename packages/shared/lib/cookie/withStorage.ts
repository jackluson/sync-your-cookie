import { ICookie } from '@sync-your-cookie/protobuf';
import { Cookie, cookieStorage } from '@sync-your-cookie/storage/lib/cookieStorage';
import { domainConfigStorage } from '@sync-your-cookie/storage/lib/domainConfigStorage';

import { AccountInfo, cloudflareStorage } from '@sync-your-cookie/storage/lib/cloudflareStorage';

import { WriteResponse } from '../cloudflare';
import {
  mergeAndWriteCookies,
  mergeAndWriteMultipleDomainCookies,
  readCookiesMap,
  removeAndWriteCookies,
} from './withCloudflare';

export const readCookiesMapWithStatus = async (cloudflareInfo: AccountInfo) => {
  let cookieMap: Cookie | null = null;
  const domainConfig = await domainConfigStorage.get();
  if (domainConfig.pushing) {
    cookieMap = await cookieStorage.getSnapshot();
  }
  if (cookieMap && Object.keys(cookieMap.domainCookieMap || {}).length > 0) {
    return cookieMap;
  }
  return await readCookiesMap(cloudflareInfo);
};

export const pullCookies = async (isInit = false): Promise<Cookie> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    const domainConfig = await domainConfigStorage.get();
    if (domainConfig.pulling) {
      const cookieMap = await cookieStorage.getSnapshot();
      if (cookieMap && Object.keys(cookieMap.domainCookieMap || {}).length > 0) {
        return cookieMap;
      }
    }
    await domainConfigStorage.update({
      pulling: true,
    });
    const cookieMap = await readCookiesMapWithStatus(cloudflareInfo);
    const res = await cookieStorage.update(cookieMap, isInit);
    return res;
  } catch (e) {
    console.log('pullCookies fail', e);
    return Promise.reject(e);
  } finally {
    await domainConfigStorage.update({
      pulling: false,
    });
  }
};

export const pullAndSetCookies = async (activeTabUrl: string, host: string, isReload = true): Promise<Cookie> => {
  const cookieMap = await pullCookies();
  const cookieDetails = cookieMap?.domainCookieMap?.[host]?.cookies || [];
  if (cookieDetails.length === 0) {
    throw new Error('No cookies to pull, push first please');
  } else {
    const cookiesPromiseList: Promise<unknown>[] = [];

    for (const cookie of cookieDetails) {
      if (cookie.domain?.includes(host)) {
        console.log('cookie', cookie);
        const cookieDetail: chrome.cookies.SetDetails = {
          domain: cookie.domain,
          name: cookie.name ?? undefined,
          url: activeTabUrl,
          storeId: cookie.storeId ?? undefined,
          value: cookie.value ?? undefined,
          expirationDate: cookie.expirationDate ?? undefined,
          path: cookie.path ?? undefined,
          httpOnly: cookie.httpOnly ?? undefined,
          secure: cookie.secure ?? undefined,
          sameSite: (cookie.sameSite ?? undefined) as chrome.cookies.SameSiteStatus,
        };
        const promise = new Promise((resolve, reject) => {
          try {
            try {
              chrome.cookies.set(cookieDetail, res => {
                console.log('set cookier result', res);
                resolve(res);
              });
            } catch (error) {
              reject(error);
            }
          } catch (error) {
            console.log('set cookie error', error);
            reject(error);
          }
        });
        cookiesPromiseList.push(promise);
      }
    }
    // reload window after set cookies
    // await new Promise(resolve => {
    //   setTimeout(resolve, 5000);
    // });
    await Promise.allSettled(cookiesPromiseList);
    if (isReload) {
      await chrome.tabs.reload();
    }
  }
  return cookieMap;
};

export const pushCookies = async (domain: string, cookies: ICookie[]): Promise<WriteResponse> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    const domainConfig = await domainConfigStorage.get();
    if (domainConfig.pushing) return Promise.reject('the cookie is pushing');
    await domainConfigStorage.update({
      pushing: true,
    });
    const oldCookie = await readCookiesMapWithStatus(cloudflareInfo);
    const [res, cookieMap] = await mergeAndWriteCookies(cloudflareInfo, domain, cookies, oldCookie);

    if (res.success) {
      await cookieStorage.update(cookieMap);
    }
    return res;
  } catch (e) {
    console.log('pushCookies fail err', e);
    // console.log('-->after', await domainConfigStorage.get());
    return Promise.reject(e);
  } finally {
    await domainConfigStorage.update({
      pushing: false,
    });
  }
};

export const pushMultipleDomainCookies = async (
  domainCookies: { domain: string; cookies: ICookie[] }[],
): Promise<WriteResponse> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    const domainConfig = await domainConfigStorage.get();
    if (domainConfig.pushing) return Promise.reject('cookie is pushing');
    await domainConfigStorage.update({
      pushing: true,
    });
    const oldCookie = await readCookiesMapWithStatus(cloudflareInfo);
    const [res, cookieMap] = await mergeAndWriteMultipleDomainCookies(cloudflareInfo, domainCookies, oldCookie);
    await domainConfigStorage.update({
      pushing: false,
    });
    if (res.success) {
      cookieStorage.update(cookieMap);
    }
    return res;
  } catch (e) {
    console.log('pushMultipleDomainCookies fail err', e);
    await domainConfigStorage.update({
      pushing: false,
    });
    return Promise.reject(e);
  }
};

export const removeCookies = async (domain: string): Promise<WriteResponse> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    const domainConfig = await domainConfigStorage.get();
    if (domainConfig.pushing) return Promise.reject('the cookie is pushing');
    await domainConfigStorage.update({
      pushing: true,
    });
    // const oldCookie = await cookieStorage.get();
    const oldCookie = await readCookiesMapWithStatus(cloudflareInfo);
    const [res, cookieMap] = await removeAndWriteCookies(cloudflareInfo, domain, oldCookie);
    await domainConfigStorage.update({
      pushing: false,
    });
    if (res.success) {
      cookieStorage.update(cookieMap);
    }
    return res;
  } catch (e) {
    console.log('removeCookies fail err', e);
    await domainConfigStorage.update({
      pushing: false,
    });
    return Promise.reject(e);
  }
};
