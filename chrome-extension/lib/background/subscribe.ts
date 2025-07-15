import { cloudflareStorage } from '@sync-your-cookie/storage/lib/cloudflareStorage';
import { domainStatusStorage } from '@sync-your-cookie/storage/lib/domainStatusStorage';

import { pullCookies } from '@sync-your-cookie/shared';
import { cookieStorage } from '@sync-your-cookie/storage/lib/cookieStorage';
import { clearBadge, setPullingBadge, setPushingAndPullingBadge, setPushingBadge } from './badge';

export const initSubscribe = async () => {
  await domainStatusStorage.resetState();
  domainStatusStorage.subscribe(async () => {
    const domainStatus = await domainStatusStorage.get();
    if (domainStatus?.pulling && domainStatus.pushing) {
      setPushingAndPullingBadge();
    } else if (domainStatus?.pushing) {
      setPushingBadge();
    } else if (domainStatus?.pulling) {
      setPullingBadge();
    } else {
      clearBadge();
    }
  });

  cloudflareStorage.subscribe(async () => {
    await domainStatusStorage.resetState();
    await cookieStorage.reset();
    await pullCookies();
    console.log("reset finished");
  });
};
