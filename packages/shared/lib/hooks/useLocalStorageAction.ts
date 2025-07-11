import {
  MessageErrorCode,
  pullLocalStorageUsingMessage,
  pushLocalStorageUsingMessage,
  removeLocalStorageUsingMessage,
} from '../message';
import { domainConfigStorage } from '@sync-your-cookie/storage/lib/domainConfigStorage';
import { toast as Toast } from 'sonner';
import { useStorageSuspense } from './index';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const catchHandler = (err: any, scene: 'push' | 'pull' | 'remove' | 'delete' | 'edit', toast: typeof Toast) => {
  const defaultMsg = `${scene} localStorage fail`;
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
  console.log('localStorage err', err);
};

export const useLocalStorageAction = (host: string, toast: typeof Toast) => {
  const domainConfig = useStorageSuspense(domainConfigStorage);

  const handlePush = async (selectedHost = host, sourceUrl?: string, favIconUrl?: string) => {
    return pushLocalStorageUsingMessage({
      host: selectedHost,
      sourceUrl,
      favIconUrl,
    })
      .then(res => {
        if (res.isOk) {
          toast.success('Pushed localStorage success');
        } else {
          toast.error(res.msg || 'Pushed localStorage fail');
        }
        console.log('localStorage push res', res);
      })
      .catch(err => {
        catchHandler(err, 'push', toast);
      });
  };

  const handlePull = async (activeTabUrl: string, selectedDomain = host, reload = true) => {
    return pullLocalStorageUsingMessage({
      activeTabUrl: activeTabUrl,
      domain: selectedDomain,
      reload,
    })
      .then(res => {
        console.log('localStorage pull res', res);
        if (res.isOk) {
          toast.success('Pull localStorage success');
        } else {
          toast.error(res.msg || 'Pull localStorage fail');
        }
      })
      .catch(err => {
        catchHandler(err, 'pull', toast);
      });
  };

  const handleRemove = async (selectedDomain = host) => {
    return removeLocalStorageUsingMessage({
      domain: selectedDomain,
    })
      .then(async res => {
        console.log('localStorage remove res', res);
        if (res.isOk) {
          toast.success(res.msg || 'localStorage removed success');
          await domainConfigStorage.removeItem(host);
        } else {
          toast.error(res.msg || 'Remove localStorage fail');
        }
        console.log('localStorage remove res', res);
      })
      .catch(err => {
        catchHandler(err, 'remove', toast);
      });
  };

  return {
    pulling: domainConfig.pulling,
    pushing: domainConfig.pushing,
    domainItemConfig: domainConfig.domainMap[host] || {},
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