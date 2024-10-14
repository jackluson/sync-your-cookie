import { useStorageSuspense } from '@sync-your-cookie/shared';
import { domainConfigStorage } from '@sync-your-cookie/storage';
import { useState } from 'react';

export const useDomainConfig = () => {
  const [domain, setDomain] = useState('');
  const domainConfig = useStorageSuspense(domainConfigStorage);

  const toggleAutoPullState = (checked?: boolean) => {
    domainConfigStorage.updateItem(domain, {
      autoPull: checked ?? !domainConfig.domainMap[domain]?.autoPull,
    });
  };

  const togglePullingState = (checked?: boolean) => {
    domainConfigStorage.updateItem(domain, {
      pulling: checked ?? !domainConfig.domainMap[domain]?.pulling,
    });
  };

  const toggleAutoPushState = (checked?: boolean) => {
    domainConfigStorage.updateItem(domain, {
      autoPush: checked ?? !domainConfig.domainMap[domain]?.autoPush,
    });
  };

  const togglePushingState = (checked?: boolean) => {
    domainConfigStorage.updateItem(domain, {
      pushing: checked ?? !domainConfig.domainMap[domain]?.pushing,
    });
  };

  return {
    domain,
    setDomain,
    pulling: domainConfig.pulling,
    pushing: domainConfig.pushing,
    domainConfig: domainConfig.domainMap[domain] || {},
    toggleAutoPullState,
    toggleAutoPushState,
    togglePullingState,
    togglePushingState,
  };
};
