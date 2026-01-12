import { ICookie, ICookiesMap, ILocalStorageItem } from '@sync-your-cookie/protobuf';
import { Cookie, cookieStorage } from '@sync-your-cookie/storage/lib/cookieStorage';
import { domainStatusStorage } from '@sync-your-cookie/storage/lib/domainStatusStorage';

import { AccountInfo, accountStorage } from '@sync-your-cookie/storage/lib/accountStorage';

import { MessageType, sendMessage } from '@lib/message';
import { RestEndpointMethodTypes } from '@octokit/rest';
import { OctokitResponse } from '@octokit/types';
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
  const cloudflareInfo = await accountStorage.get();
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
    await domainStatusStorage.update({
      pulling: false,
    });
    return res;
  } catch (e) {
    console.error('pullCookies fail', e);
    await domainStatusStorage.update({
      pulling: false,
    });
    return Promise.reject(e);
  }
};
function extractPortRegex(host: string) {
  const match = host.match(/:(\d+)$/);
  return match ? match[1] : null;
}
export const pullAndSetCookies = async (activeTabUrl: string, host: string, isReload = true): Promise<Cookie> => {
  const cookieMap = await pullCookies();
  const cookieDetails = cookieMap?.domainCookieMap?.[host]?.cookies || [];
  const localStorageItems = cookieMap?.domainCookieMap?.[host]?.localStorageItems || [];
  if (cookieDetails.length === 0 && localStorageItems.length === 0) {
    console.warn('no cookies to pull, push first please', host, cookieMap);
    throw new Error('No cookies to pull, push first please');
  } else {
    const cookiesPromiseList: Promise<unknown>[] = [];
    for (const cookie of cookieDetails) {
      let removeWWWHost = host.replace('www.', '');
      const port = extractPortRegex(removeWWWHost);
      if (port) {
        removeWWWHost = removeWWWHost.replace(':' + port, '');
      }

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
            chrome.cookies.set(cookieDetail, res => {
              resolve(res);
            });
          } catch (error) {
            console.error('cookie set error', cookieDetail, error);
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
    await sendMessage(
      {
        type: MessageType.SetLocalStorage,
        payload: {
          domain: host,
          value: localStorageItems,
        },
      },
      true,
    )
      .then(res => {
        console.log('set local storage', res);
      })
      .catch(err => {
        console.error('set local storage error', err);
      });

    if (cookiesPromiseList.length === 0 && localStorageItems.length === 0) {
      console.warn('no matched cookies and localStorageItems to pull, push first please', host, cookieMap);
      throw new Error('No matched cookies and localStorageItems to pull, push first please');
    }
    await Promise.allSettled(cookiesPromiseList);
    if (isReload) {
      chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
          // 使用字符串匹配
          if (tab.url && tab.url.includes(host) && tab.id) {
            console.log('tab', tab);
            chrome.tabs.reload(tab.id);
          }
        });
      });
    }
  }
  return cookieMap;
};

export type GistUpdateResponse = RestEndpointMethodTypes['gists']['update']['response'];

export type PushCookiesResponse = WriteResponse | GistUpdateResponse;

const checkSuccessAndUpdate = async (
  accountInfo: AccountInfo,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: WriteResponse | OctokitResponse<any>,
  cookieMap: ICookiesMap,
) => {
  if (accountInfo.selectedProvider === 'github') {
    if ((res as unknown as GistUpdateResponse)?.status?.toString()?.startsWith('2')) {
      await cookieStorage.update(cookieMap);
    }
  } else {
    if ((res as WriteResponse).success) {
      await cookieStorage.update(cookieMap);
    }
  }
};

export const pushCookies = async (
  domain: string,
  cookies: ICookie[],
  localStorageItems: ILocalStorageItem[] = [],
): Promise<PushCookiesResponse> => {
  const accountInfo = await accountStorage.get();
  try {
    const domainStatus = await domainStatusStorage.get();
    if (domainStatus.pushing) return Promise.reject('the cookie is pushing');
    await domainStatusStorage.update({
      pushing: true,
    });
    const oldCookie = await readCookiesMapWithStatus(accountInfo);
    const [res, cookieMap] = await mergeAndWriteCookies(accountInfo, domain, cookies, localStorageItems, oldCookie);
    console.log('res->pushCookies', res);
    await checkSuccessAndUpdate(accountInfo, res, cookieMap);
    await domainStatusStorage.update({
      pushing: false,
    });
    return res;
  } catch (e) {
    console.error('pushCookies fail err', e);
    await domainStatusStorage.update({
      pushing: false,
    });
    return Promise.reject(e);
  }
};

export const pushMultipleDomainCookies = async (
  domainCookies: { domain: string; cookies: ICookie[]; localStorageItems: ILocalStorageItem[] }[],
): Promise<WriteResponse> => {
  const accountInfo = await accountStorage.get();
  try {
    const domainStatus = await domainStatusStorage.get();
    if (domainStatus.pushing) return Promise.reject('cookie is pushing');
    await domainStatusStorage.update({
      pushing: true,
    });
    const oldCookie = await readCookiesMapWithStatus(accountInfo);
    const [res, cookieMap] = await mergeAndWriteMultipleDomainCookies(accountInfo, domainCookies, oldCookie);
    await domainStatusStorage.update({
      pushing: false,
    });
    await checkSuccessAndUpdate(accountInfo, res, cookieMap);
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
  const accountInfo = await accountStorage.get();
  try {
    const domainStatus = await domainStatusStorage.get();
    if (domainStatus.pushing) return Promise.reject('the cookie is pushing');
    await domainStatusStorage.update({
      pushing: true,
    });
    // const oldCookie = await cookieStorage.get();
    const oldCookie = await readCookiesMapWithStatus(accountInfo);
    const [res, cookieMap] = await removeAndWriteCookies(accountInfo, domain, oldCookie);
    await domainStatusStorage.update({
      pushing: false,
    });
    await checkSuccessAndUpdate(accountInfo, res, cookieMap);
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
  const accountInfo = await accountStorage.get();
  try {
    const domainStatus = await domainStatusStorage.get();
    if (domainStatus.pushing) return Promise.reject('the cookie is pushing');
    await domainStatusStorage.update({
      pushing: true,
    });
    // const oldCookie = await cookieStorage.get();
    const oldCookie = await readCookiesMapWithStatus(accountInfo);
    const [res, cookieMap] = await removeAndWriteCookies(accountInfo, domain, oldCookie, id);
    await domainStatusStorage.update({
      pushing: false,
    });
    await checkSuccessAndUpdate(accountInfo, res, cookieMap);
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
  const accountInfo = await accountStorage.get();
  try {
    const domainStatus = await domainStatusStorage.get();
    if (domainStatus.pushing) return Promise.reject('the cookie is pushing');
    await domainStatusStorage.update({
      pushing: true,
    });
    // const oldCookie = await cookieStorage.get();
    const oldCookie = await readCookiesMapWithStatus(accountInfo);
    const [res, cookieMap] = await removeAndWriteCookies(accountInfo, domain, oldCookie, name);
    await domainStatusStorage.update({
      pushing: false,
    });
    await checkSuccessAndUpdate(accountInfo, res, cookieMap);
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
    const cloudflareInfo = await accountStorage.get();
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

      await checkSuccessAndUpdate(cloudflareInfo, res, cookieMap);

      return res;
    } catch (e) {
      console.error('removeCookieItem fail err', e);
      await this.setPushing(false);
      return Promise.reject(e);
    }
  }
}
