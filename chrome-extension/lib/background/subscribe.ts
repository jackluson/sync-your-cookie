import { cloudflareStorage } from '@sync-your-cookie/storage/lib/cloudflareStorage';
import { domainConfigStorage } from '@sync-your-cookie/storage/lib/domainConfigStorage';

import { pullCookies } from '@sync-your-cookie/shared';
import { cookieStorage } from '@sync-your-cookie/storage/lib/cookieStorage';
import { clearBadge, setPullingBadge, setPushingAndPullingBadge, setPushingBadge } from './badge';

export const initSubscribe = async () => {
  await domainConfigStorage.resetState();
  domainConfigStorage.subscribe(async () => {
    const domainConfig = await domainConfigStorage.get();
    if (domainConfig?.pulling && domainConfig.pushing) {
      setPushingAndPullingBadge();
    } else if (domainConfig?.pushing) {
      setPushingBadge();
    } else if (domainConfig?.pulling) {
      setPullingBadge();
    } else {
      clearBadge();
    }
  });

  cloudflareStorage.subscribe(async () => {
    await domainConfigStorage.resetState();
    await cookieStorage.reset();
    await pullCookies();
  });
};
