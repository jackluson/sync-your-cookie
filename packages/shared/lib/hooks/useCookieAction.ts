import {
  MessageErrorCode,
  pullCookieUsingMessage,
  pushCookieUsingMessage,
  removeCookieUsingMessage,
} from '@lib/message';
import { domainConfigStorage } from '@sync-your-cookie/storage/lib/domainConfigStorage';
import { toast as Toast } from 'sonner';
import { useStorageSuspense } from './index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const catchHandler = (err: any, scene: 'push' | 'pull' | 'remove', toast: typeof Toast) => {
  const defaultMsg = `${scene} fail`;
  if (err?.code === MessageErrorCode.AccountCheck || err?.code === MessageErrorCode.CloudflareNotFoundRoute) {
    toast.error(err?.msg || err?.result?.message || defaultMsg, {
      action: {
        label: 'go to settings',
        onClick: () => {
          chrome.runtime.openOptionsPage();
        },
      },
    });
  } else {
    toast.error(err?.msg || defaultMsg);
  }
  console.log('err', err);
};

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
        catchHandler(err, 'push', toast);
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
        catchHandler(err, 'pull', toast);
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
        catchHandler(err, 'remove', toast);
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
