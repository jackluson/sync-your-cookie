import { ICookie, ICookiesMap } from '@sync-your-cookie/protobuf';
import { cloudflareStorage, cookieStorage, domainConfigStorage } from '@sync-your-cookie/storage';
import { WriteResponse } from '../cloudflare';
import { mergeAndWriteCookies, readCookiesMap } from './withCloudflare';

export const pullCookies = async (isInit = false): Promise<ICookiesMap> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    domainConfigStorage.update({
      pulling: true,
    });
    const cookieMap = await readCookiesMap(cloudflareInfo);
    return cookieStorage.update(cookieMap, isInit);
  } finally {
    domainConfigStorage.update({
      pulling: false,
    });
  }
};

export const pushCookies = async (domain: string, cookies: ICookie[]): Promise<WriteResponse> => {
  const cloudflareInfo = await cloudflareStorage.get();
  try {
    domainConfigStorage.update({
      pushing: true,
    });

    const [res, cookieMap] = await mergeAndWriteCookies(cloudflareInfo, domain, cookies);
    if (res.success) {
      cookieStorage.update(cookieMap);
    }
    return res;
  } finally {
    domainConfigStorage.update({
      pushing: false,
    });
  }
};
