import { ICookie, ICookiesMap } from '@sync-your-cookie/protobuf';
import { cloudflareStorage, cookieStorage, domainConfigStorage } from '@sync-your-cookie/storage';
import { WriteResponse } from '../cloudflare';
import { mergeAndWriteCookies, readCookiesMap } from './withCloudflare';

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

export const pushCookies = async (domain: string, cookies: ICookie[]): Promise<WriteResponse> => {
  const cloudflareInfo = await cloudflareStorage.get();
  console.log('cloudflareInfo', cloudflareInfo);
  try {
    await domainConfigStorage.update({
      pushing: true,
    });
    const [res, cookieMap] = await mergeAndWriteCookies(cloudflareInfo, domain, cookies);
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
