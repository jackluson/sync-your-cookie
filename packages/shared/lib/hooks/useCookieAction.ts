import { ErrorCode } from '@lib/cloudflare';
import { pullCookieUsingMessage, pushCookieUsingMessage } from '@lib/message';
import { domainConfigStorage } from '@sync-your-cookie/storage';
import { toast as Toast } from 'sonner';
import { useStorageSuspense } from './index';

export const useCookieAction = (domain: string, toast: typeof Toast) => {
  const domainConfig = useStorageSuspense(domainConfigStorage);

  const handlePush = async () => {
    pushCookieUsingMessage({
      domain,
    })
      .then(res => {
        if (res.isOk) {
          toast.success('Pushed success');
        } else {
          toast.error(res.msg || 'Pushed fail');
        }
        console.log('res', res);
      })
      .catch(err => {
        if (err.result?.errors?.length && err.result.errors[0].code === ErrorCode.NotFoundRoute) {
          toast.error('cloudflare account info is incorrect', {
            action: {
              label: 'go to settings',
              onClick: () => {
                chrome.runtime.openOptionsPage();
              },
            },
          });
        } else {
          toast.error(err.msg || 'Pushed fail');
        }
        console.log('err', err);
      });
  };

  const handlePull = async (activeTabUrl: string) => {
    pullCookieUsingMessage({
      activeTabUrl: activeTabUrl,
      domain: domain,
    })
      .then(res => {
        if (res.isOk) {
          toast.success('Pull success');
        } else {
          toast.error(res.msg || 'Pull fail');
        }
      })
      .catch(err => {
        console.log('err', err);
        if (err.result?.errors?.length && err.result.errors[0].code === ErrorCode.NotFoundRoute) {
          toast.error('cloudflare account info is incorrect', {
            action: {
              label: 'go to settings',
              onClick: () => {
                chrome.runtime.openOptionsPage();
              },
            },
          });
        } else {
          toast.error(err.msg || 'Pull fail');
        }
      });
  };

  return {
    // domainConfig: domainConfig as typeof domainConfig,
    pulling: domainConfig.pulling,
    pushing: domainConfig.pushing,
    domainItemConfig: domainConfig.domainMap[domain] || {},
    getDomainItemConfig: (selectedDomain: string) => {
      return domainConfig.domainMap[selectedDomain] || {};
    },
    toggleAutoPullState: domainConfigStorage.toggleAutoPullState,
    toggleAutoPushState: domainConfigStorage.toggleAutoPushState,
    togglePullingState: domainConfigStorage.togglePullingState,
    togglePushingState: domainConfigStorage.togglePushingState,
    handlePush,
    handlePull,
  };
};
