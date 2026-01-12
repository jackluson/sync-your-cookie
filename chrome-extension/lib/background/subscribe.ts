import { accountStorage } from '@sync-your-cookie/storage/lib/accountStorage';
import { domainStatusStorage } from '@sync-your-cookie/storage/lib/domainStatusStorage';

import { pullCookies } from '@sync-your-cookie/shared';
import { cookieStorage } from '@sync-your-cookie/storage/lib/cookieStorage';
import { settingsStorage } from '@sync-your-cookie/storage/lib/settingsStorage';
import { clearBadge, setPullingBadge, setPushingAndPullingBadge, setPushingBadge } from './badge';
import { initContextMenu, removeContextMenu } from './contextMenu';

export const initSubscribe = async () => {
  await domainStatusStorage.resetState();
  domainStatusStorage.subscribe(async () => {
    const domainStatus = await domainStatusStorage.get();
    if (domainStatus?.pulling && domainStatus.pushing) {
      setPushingAndPullingBadge();
    } else if (domainStatus?.pushing) {
      setPushingBadge();
    } else if (domainStatus?.pulling) {
      setPullingBadge();
    } else {
      clearBadge();
    }
  });

  accountStorage.subscribe(async () => {
    await domainStatusStorage.resetState();
    await cookieStorage.reset();
    await pullCookies();
    console.log('reset finished');
  });

  let previousContextMenu: boolean | undefined = undefined;

  settingsStorage.subscribe(async () => {
    const settingsSnapShot = await settingsStorage.getSnapshot();
    if (previousContextMenu === settingsSnapShot?.contextMenu) {
      return;
    }
    previousContextMenu = settingsSnapShot?.contextMenu;
    if (settingsSnapShot?.contextMenu) {
      initContextMenu();
    } else {
      removeContextMenu();
    }
  });
};
