import { ICookie } from '@sync-your-cookie/protobuf';
import { Cookie, cookieStorage } from '@sync-your-cookie/storage/lib/cookieStorage';
import { domainStatusStorage } from '@sync-your-cookie/storage/lib/domainStatusStorage';

import { AccountInfo, cloudflareStorage } from '@sync-your-cookie/storage/lib/cloudflareStorage';

import { WriteResponse } from '../cloudflare';
import {
  editAndWriteCookies,
  mergeAndWriteCookies,
  mergeAndWriteMultipleDomainCookies,
  readCookiesMap,
  removeAndWriteCookies,
} from './withCloudflare';

export const readCookiesMapWithStatus = async (cloudflareInfo: AccountInfo) => {
  let cookieMap: Cookie | null = null;
  const domainStatus = await domainStatusStorage.get();
  if (domainStatus.pushing) {
    cookieMap = await cookieStorage.getSnapshot();
  }
  if (cookieMap && Object.keys(cookieMap.domainCookieMap || {}).length > 0) {
    return cookieMap;
  }
  return await readCookiesMap(cloudflareInfo);
};

export const pullCookies = async (isInit = false): Promise<Cookie> => {
  const cloudflareInfo = await cloudflareStorage.get();
  if (isInit && (!cloudflareInfo.accountId || !cloudflareInfo.namespaceId || !cloudflareInfo.token)) {
    return {};
  }
  try {
    const domainStatus = await domainStatusStorage.get();
    if (domainStatus.pulling) {
      const cookieMap = await cookieStorage.getSnapshot();
      if (cookieMap && Object.keys(cookieMap.domainCookieMap || {}).length > 0) {
        return cookieMap;
      }
    }
    await domainStatusStorage.update({
      pulling: true,
    });
    const cookieMap = await readCookiesMapWithStatus(cloudflareInfo);
    const res = await cookieStorage.update(cookieMap, isInit);
    return res;
  } catch (e) {
    console.error('pullCookies fail', e);
    return Promise.reject(e);
  } finally {
    await domainStatusStorage.update({
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
      const removeWWWHost = host.replace('www.', '');
      if (cookie.domain?.includes(removeWWWHost)) {
        let url = activeTabUrl;
        if (cookie.domain) {
          const urlObj = new URL(activeTabUrl);
          const protocol = activeTabUrl ? urlObj.protocol : 'http:';
          const itemHost = cookie.domain.startsWith('.') ? cookie.domain.slice(1) : cookie.domain;
          url = `${protocol}//${itemHost}`;
        }
        const cookieDetail: chrome.cookies.SetDetails = {
          domain: cookie.domain,
          name: cookie.name ?? undefined,
          url: url,
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
                resolve(res);
              });
            } catch (error) {
              console.error('cookie set error', cookieDetail, error);
              reject(error);
            }
          } catch (error) {
            console.error('set cookie error', cookieDetail, error);
            reject(error);
          }
        });
        cookiesPromiseList.push(promise);
      }
    }
    if (cookiesPromiseList.length === 0) {
      throw new Error('No cookies to pull, push first please');
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
    const domainStatus = await domainStatusStorage.get();
    if (domainStatus.pushing) return Promise.reject('the cookie is pushing');
    await domainStatusStorage.update({
      pushing: true,
    });
    const oldCookie = await readCookiesMapWithStatus(cloudflareInfo);
    const [res, cookieMap] = await mergeAndWriteCookies(cloudflareInfo, domain, cookies, oldCookie);

    if (res.success) {
      await cookieStorage.update(cookieMap);
    }
    return res;
  } catch (e) {
    console.error('pushCookies fail err', e);
    return Promise.reject(e);
  } finally {
    await domainStatusStorage.update({
      pushing: false,
    });
  }
};

export const pushMultipleDomainCookies = async (
  domainCookies: { domain: string; cookies: ICookie[] }[],
): Promise<WriteResponse> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    const domainStatus = await domainStatusStorage.get();
    if (domainStatus.pushing) return Promise.reject('cookie is pushing');
    await domainStatusStorage.update({
      pushing: true,
    });
    const oldCookie = await readCookiesMapWithStatus(cloudflareInfo);
    const [res, cookieMap] = await mergeAndWriteMultipleDomainCookies(cloudflareInfo, domainCookies, oldCookie);
    await domainStatusStorage.update({
      pushing: false,
    });
    if (res.success) {
      cookieStorage.update(cookieMap);
    }
    return res;
  } catch (e) {
    console.error('pushMultipleDomainCookies fail err', e);
    await domainStatusStorage.update({
      pushing: false,
    });
    return Promise.reject(e);
  }
};

export const removeCookies = async (domain: string): Promise<WriteResponse> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    const domainStatus = await domainStatusStorage.get();
    if (domainStatus.pushing) return Promise.reject('the cookie is pushing');
    await domainStatusStorage.update({
      pushing: true,
    });
    // const oldCookie = await cookieStorage.get();
    const oldCookie = await readCookiesMapWithStatus(cloudflareInfo);
    const [res, cookieMap] = await removeAndWriteCookies(cloudflareInfo, domain, oldCookie);
    await domainStatusStorage.update({
      pushing: false,
    });
    if (res.success) {
      cookieStorage.update(cookieMap);
    }
    return res;
  } catch (e) {
    console.error('removeCookies fail err', e);
    await domainStatusStorage.update({
      pushing: false,
    });
    return Promise.reject(e);
  }
};

export const removeCookieItem = async (domain: string, id: string): Promise<WriteResponse> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    const domainStatus = await domainStatusStorage.get();
    if (domainStatus.pushing) return Promise.reject('the cookie is pushing');
    await domainStatusStorage.update({
      pushing: true,
    });
    // const oldCookie = await cookieStorage.get();
    const oldCookie = await readCookiesMapWithStatus(cloudflareInfo);
    const [res, cookieMap] = await removeAndWriteCookies(cloudflareInfo, domain, oldCookie, id);
    await domainStatusStorage.update({
      pushing: false,
    });
    if (res.success) {
      cookieStorage.update(cookieMap);
    }
    return res;
  } catch (e) {
    console.error('removeCookieItem fail err', e);
    await domainStatusStorage.update({
      pushing: false,
    });
    return Promise.reject(e);
  }
};

export const editCookieItem = async (domain: string, name: string): Promise<WriteResponse> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    const domainStatus = await domainStatusStorage.get();
    if (domainStatus.pushing) return Promise.reject('the cookie is pushing');
    await domainStatusStorage.update({
      pushing: true,
    });
    // const oldCookie = await cookieStorage.get();
    const oldCookie = await readCookiesMapWithStatus(cloudflareInfo);
    const [res, cookieMap] = await removeAndWriteCookies(cloudflareInfo, domain, oldCookie, name);
    await domainStatusStorage.update({
      pushing: false,
    });
    if (res.success) {
      cookieStorage.update(cookieMap);
    }
    return res;
  } catch (e) {
    console.error('removeCookieItem fail err', e);
    await domainStatusStorage.update({
      pushing: false,
    });
    return Promise.reject(e);
  }
};

export class CookieOperator {
  static async prepare() {
    const cloudflareInfo = await cloudflareStorage.get();
    const domainStatus = await domainStatusStorage.get();
    if (domainStatus.pushing) return Promise.reject('the cookie is pushing');
    return { cloudflareInfo };
  }

  static async setPushing(open: boolean) {
    await domainStatusStorage.update({
      pushing: open,
    });
  }

  static async editCookieItem(host: string, oldItem: ICookie, newItem: ICookie) {
    try {
      const { cloudflareInfo } = await this.prepare();
      await this.setPushing(true);
      const oldCookie = await readCookiesMapWithStatus(cloudflareInfo);
      const [res, cookieMap] = await editAndWriteCookies(cloudflareInfo, host, oldCookie, oldItem, newItem);
      await this.setPushing(false);

      if (res.success) {
        cookieStorage.update(cookieMap);
      }
      return res;
    } catch (e) {
      console.error('removeCookieItem fail err', e);
      await this.setPushing(false);
      return Promise.reject(e);
    }
  }
}
