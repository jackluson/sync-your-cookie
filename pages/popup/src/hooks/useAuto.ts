import { useStorageSuspense } from '@sync-your-cookie/shared';
import { domainConfigStorage } from '@sync-your-cookie/storage';
import { useState } from 'react';

export const useAuto = () => {
  const [domain, setDomain] = useState('');
  const domainConfig = useStorageSuspense(domainConfigStorage);

  const togglePullState = (checked?: boolean) => {
    domainConfigStorage.updateItem(domain, {
      autoPull: checked ?? !domainConfig.domainMap[domain]?.autoPull,
    });
  };

  const togglePushState = (checked?: boolean) => {
    domainConfigStorage.updateItem(domain, {
      autoPush: checked ?? !domainConfig.domainMap[domain]?.autoPush,
    });
  };

  return {
    domain,
    setDomain,
    domainConfig: domainConfig.domainMap[domain] || {},
    togglePullState,
    togglePushState,
  };
};
