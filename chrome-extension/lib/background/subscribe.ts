import { domainConfigStorage } from '@sync-your-cookie/storage';
import { clearBadge, setPullingBadge, setPushingAndPullingBadge, setPushingBadge } from './badge';

export const initSubscribe = async () => {
  domainConfigStorage.subscribe(() => {
    const domainConfig = domainConfigStorage.getSnapshot();
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
