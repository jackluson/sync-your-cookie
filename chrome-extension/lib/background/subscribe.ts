import { domainConfigStorage } from '@sync-your-cookie/storage';
import { clearBadge, setPullingBadge, setPushingAndPullingBadge, setPushingBadge } from './badge';

export const initSubscribe = async () => {
  await domainConfigStorage.resetState();
  domainConfigStorage.subscribe(() => {
    const domainConfig = domainConfigStorage.getSnapshot();
    console.log('domainConfig', domainConfig);
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
