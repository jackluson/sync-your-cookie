import { ErrorCode } from '@lib/cloudflare';
import { pullCookieUsingMessage, pushCookieUsingMessage, removeCookieUsingMessage } from '@lib/message';
import { domainConfigStorage } from '@sync-your-cookie/storage';
import { toast as Toast } from 'sonner';
import { useStorageSuspense } from './index';

export const useCookieAction = (domain: string, toast: typeof Toast) => {
  const domainConfig = useStorageSuspense(domainConfigStorage);

  const handlePush = async (selectedDomain = domain) => {
    return pushCookieUsingMessage({
      domain: selectedDomain,
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

  const handlePull = async (activeTabUrl: string, selectedDomain = domain, reload = true) => {
    return pullCookieUsingMessage({
      activeTabUrl: activeTabUrl,
      domain: selectedDomain,
      reload,
    })
      .then(res => {
        console.log('res', res);
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

  const handleRemove = async (selectedDomain = domain) => {
    return removeCookieUsingMessage({
      domain: selectedDomain,
    })
      .then(async res => {
        console.log('res', res);
        if (res.isOk) {
          toast.success(res.msg || 'success');
          await domainConfigStorage.removeItem(domain);
        } else {
          toast.error(res.msg || 'Removed fail');
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
          toast.error(err.msg || 'Removed fail');
        }
        console.log('err', err);
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
    handleRemove,
  };
};
