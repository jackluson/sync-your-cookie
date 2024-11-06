import { domainConfigStorage } from '@sync-your-cookie/storage/lib/domainConfigStorage';
import { clearBadge, setPullingBadge, setPushingAndPullingBadge, setPushingBadge } from './badge';

export const initSubscribe = async () => {
  await domainConfigStorage.resetState();
  domainConfigStorage.subscribe(async () => {
    const domainConfig = await domainConfigStorage.get();
    console.log('subscribe-> domainConfig', domainConfig);
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
};
