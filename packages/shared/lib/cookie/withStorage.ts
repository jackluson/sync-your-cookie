import { ICookie, ICookiesMap } from '@sync-your-cookie/protobuf';
import { cloudflareStorage, cookieStorage, domainConfigStorage } from '@sync-your-cookie/storage';
import { WriteResponse } from '../cloudflare';
import {
  mergeAndWriteCookies,
  mergeAndWriteMultipleDomainCookies,
  readCookiesMap,
  removeAndWriteCookies,
} from './withCloudflare';

export const pullCookies = async (isInit = false): Promise<ICookiesMap> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    await domainConfigStorage.update({
      pulling: true,
    });
    const cookieMap = await readCookiesMap(cloudflareInfo);
    const res = await cookieStorage.update(cookieMap, isInit);
    await domainConfigStorage.update({
      pulling: false,
    });

    return res;
  } catch (e) {
    console.log('pullCookies fail', e);
    await domainConfigStorage.update({
      pulling: false,
    });
    return Promise.reject(e);
  }
};

export const pullAndSetCookies = async (activeTabUrl: string, domain: string): Promise<ICookiesMap> => {
  const cookieMap = await pullCookies();
  const cookieDetails = cookieMap.domainCookieMap?.[domain]?.cookies || [];
  if (cookieDetails.length === 0) {
    throw new Error('No cookies to pull, push first please');
  } else {
    const cookiesPromiseList: Promise<unknown>[] = [];

    for (const cookie of cookieDetails) {
      if (cookie.domain?.includes(domain)) {
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
    await Promise.allSettled(cookiesPromiseList);
    chrome.tabs.reload();
  }
  return cookieMap;
};

export const pushCookies = async (domain: string, cookies: ICookie[]): Promise<WriteResponse> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    const isPushing = await domainConfigStorage.get();
    if (isPushing) return Promise.reject('the cookie is pushing');
    await domainConfigStorage.update({
      pushing: true,
    });
    const oldCookie = await readCookiesMap(cloudflareInfo);
    console.log('oldCookie', oldCookie);
    const [res, cookieMap] = await mergeAndWriteCookies(cloudflareInfo, domain, cookies, oldCookie);
    console.log('cookieMap', cookieMap);
    await domainConfigStorage.update({
      pushing: false,
    });
    if (res.success) {
      cookieStorage.update(cookieMap);
    }
    return res;
  } catch (e) {
    console.log('pushCookies fail err', e);
    await domainConfigStorage.update({
      pushing: false,
    });
    return Promise.reject(e);
  }
};

export const pushMultipleDomainCookies = async (
  domainCookies: { domain: string; cookies: ICookie[] }[],
): Promise<WriteResponse> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    const isPushing = await domainConfigStorage.get();
    if (isPushing) return Promise.reject('cookie is pushing');
    await domainConfigStorage.update({
      pushing: true,
    });
    const oldCookie = await readCookiesMap(cloudflareInfo);
    const [res, cookieMap] = await mergeAndWriteMultipleDomainCookies(cloudflareInfo, domainCookies, oldCookie);
    await domainConfigStorage.update({
      pushing: false,
    });
    if (res.success) {
      cookieStorage.update(cookieMap);
    }
    return res;
  } catch (e) {
    console.log('pushCookies fail err', e);
    await domainConfigStorage.update({
      pushing: false,
    });
    return Promise.reject(e);
  }
};

export const removeCookies = async (domain: string): Promise<WriteResponse> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    const isPushing = await domainConfigStorage.get();
    if (isPushing) return Promise.reject('the cookie is pushing');
    await domainConfigStorage.update({
      pushing: true,
    });
    // const oldCookie = await cookieStorage.get();
    const oldCookie = await readCookiesMap(cloudflareInfo);
    const [res, cookieMap] = await removeAndWriteCookies(cloudflareInfo, domain, oldCookie);
    await domainConfigStorage.update({
      pushing: false,
    });
    if (res.success) {
      cookieStorage.update(cookieMap);
    }
    return res;
  } catch (e) {
    console.log('pushCookies fail err', e);
    await domainConfigStorage.update({
      pushing: false,
    });
    return Promise.reject(e);
  }
};
