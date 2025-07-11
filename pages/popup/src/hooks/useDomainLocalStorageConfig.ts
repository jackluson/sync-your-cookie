import { useLocalStorageAction } from '@sync-your-cookie/shared';
import { useState } from 'react';
import { toast } from 'sonner';
export const useDomainLocalStorageConfig = () => {
  const [domain, setDomain] = useState('');
  const localStorageAction = useLocalStorageAction(domain, toast);

  return {
    domain,
    setDomain,
    ...localStorageAction,
  };
};