import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { pullAllUsingMessage, pushAllUsingMessage } from '@sync-your-cookie/shared';

export const useOneClickSync = () => {
  const [syncing, setSyncing] = useState(false);

  const handlePushAll = useCallback(
    async (domain: string, activeTabUrl: string, favIconUrl?: string) => {
      setSyncing(true);
      try {
        const res = await pushAllUsingMessage({
          host: domain,
          sourceUrl: activeTabUrl,
          favIconUrl,
        });
        if (res.isOk) {
          toast.success(res.msg);
        } else {
          toast.error(res.msg);
        }
      } catch (error: any) {
        toast.error(error?.msg || 'Push all failed');
      } finally {
        setSyncing(false);
      }
    },
    [],
  );

  const handlePullAll = useCallback(
    async (domain: string, activeTabUrl: string, reload = true) => {
      setSyncing(true);
      try {
        const res = await pullAllUsingMessage({
          domain,
          activeTabUrl,
          reload,
        });
        if (res.isOk) {
          toast.success(res.msg);
        } else {
          toast.error(res.msg);
        }
      } catch (error: any) {
        toast.error(error?.msg || 'Pull all failed');
      } finally {
        setSyncing(false);
      }
    },
    [],
  );

  return {
    syncing,
    handlePushAll,
    handlePullAll,
  };
};