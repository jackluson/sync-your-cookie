import { accountStorage, type AccountInfo } from '@sync-your-cookie/storage/lib/accountStorage';
import { getActiveStorageItem, settingsStorage } from '@sync-your-cookie/storage/lib/settingsStorage';

import { readCloudflareKV, writeCloudflareKV, WriteResponse } from '../cloudflare/api';

import { GithubApi } from '@lib/github';
import { MessageErrorCode } from '@lib/message';
import { RestEndpointMethodTypes } from '@octokit/rest';
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  decodeCookiesMap,
  decryptBase64,
  encodeCookiesMap,
  encryptBase64,
  ICookie,
  ICookiesMap,
  ILocalStorageItem,
  isBase64Encrypted,
} from '@sync-your-cookie/protobuf';

export const check = (accountInfo?: AccountInfo) => {
  const cloudflareAccountInfo = accountInfo || accountStorage.getSnapshot();
  if (cloudflareAccountInfo?.selectedProvider === 'github') {
    if (!cloudflareAccountInfo.githubAccessToken) {
      return Promise.reject({
        message: 'GitHub Access Token is empty',
        code: MessageErrorCode.AccountCheck,
      });
    }
  } else {
    if (!cloudflareAccountInfo?.accountId || !cloudflareAccountInfo.namespaceId || !cloudflareAccountInfo.token) {
      let message = 'Account ID is empty';
      if (!cloudflareAccountInfo?.namespaceId) {
        message = 'NamespaceId ID is empty';
      } else if (!cloudflareAccountInfo.token) {
        message = 'Token is empty';
      }

      return Promise.reject({
        message,
        code: MessageErrorCode.AccountCheck,
      });
    }
  }
  return cloudflareAccountInfo;
};

export const readCookiesMap = async (accountInfo: AccountInfo): Promise<ICookiesMap> => {
  let content = '';
  if (accountInfo.selectedProvider === 'github') {
    const activeStorageItem = getActiveStorageItem();
    if (activeStorageItem?.rawUrl) {
      content = await GithubApi.instance.fetchRawContent(activeStorageItem.rawUrl);
    }
  } else {
    await check(accountInfo);
    content = await readCloudflareKV(accountInfo.accountId!, accountInfo.namespaceId!, accountInfo.token!);
  }

  if (content) {
    try {
      const settingsInfo = settingsStorage.getSnapshot();
      const encryptionEnabled = settingsInfo?.encryptionEnabled;
      const encryptionPassword = settingsInfo?.encryptionPassword;

      // Check if content is encrypted and decrypt if needed
      let processedContent = content;
      const protobufEncoding = !content.startsWith('{');

      if (protobufEncoding && encryptionEnabled && encryptionPassword && isBase64Encrypted(content)) {
        try {
          processedContent = await decryptBase64(content, encryptionPassword);
        } catch (decryptError) {
          console.error('Decryption failed:', decryptError);
          // throw new Error('Failed to decrypt data. Please check your encryption password.');
          return Promise.reject({
            message: 'Failed to decrypt data. Please check your encryption password.',
            code: MessageErrorCode.DecryptFailed,
          });
        }
      }

      if (protobufEncoding) {
        const compressedBuffer = base64ToArrayBuffer(processedContent);
        const deMsg = await decodeCookiesMap(compressedBuffer);
        console.log('readCookiesMap->deMsg', deMsg);
        return deMsg;
      } else {
        console.log('readCookiesMap->res', JSON.parse(processedContent));
        return JSON.parse(processedContent);
      }
    } catch (error) {
      console.log('Decode error', error);
      // return {};
      return Promise.reject({
        message: `Decode error: ${error}, please check your save settings`,
        code: MessageErrorCode.DecodeFailed,
      });
    }
  } else {
    return {};
  }
};

export const writeCookiesMap = async (accountInfo: AccountInfo, cookiesMap: ICookiesMap = {}) => {
  const settingsInfo = settingsStorage.getSnapshot();
  const protobufEncoding = settingsInfo?.protobufEncoding;
  const encryptionEnabled = settingsInfo?.encryptionEnabled;
  const encryptionPassword = settingsInfo?.encryptionPassword;

  let encodingStr = '';
  if (protobufEncoding) {
    const buffered = await encodeCookiesMap(cookiesMap);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    encodingStr = arrayBufferToBase64(buffered as any);

    // Encrypt the data if encryption is enabled
    if (encryptionEnabled && encryptionPassword) {
      encodingStr = await encryptBase64(encodingStr, encryptionPassword);
      console.log('writeCookiesMap-> data encrypted');
    }
  } else {
    encodingStr = JSON.stringify(cookiesMap);
    console.log('writeCookiesMap->', cookiesMap);
  }
  if (accountInfo.selectedProvider === 'github') {
    const storageKeyGistId = settingsInfo?.storageKeyGistId;
    const storageKey = settingsInfo?.storageKey;
    return await GithubApi.instance.updateGist(storageKeyGistId!, storageKey!, encodingStr);
  } else {
    const res = await writeCloudflareKV(
      encodingStr,
      accountInfo.accountId!,
      accountInfo.namespaceId!,
      accountInfo.token!,
    );
    return res;
  }
};

export const mergeAndWriteCookies = async (
  accountInfo: AccountInfo,
  domain: string,
  cookies: ICookie[],
  localStorageItems: ILocalStorageItem[] = [],
  oldCookieMap: ICookiesMap = {},
): Promise<[WriteResponse | RestEndpointMethodTypes['gists']['update']['response'], ICookiesMap]> => {
  await check(accountInfo);
  const cookiesMap: ICookiesMap = {
    updateTime: Date.now(),
    createTime: oldCookieMap?.createTime || Date.now(),
    domainCookieMap: {
      ...(oldCookieMap.domainCookieMap || {}),
      [domain]: {
        updateTime: Date.now(),
        createTime: oldCookieMap.domainCookieMap?.[domain]?.createTime || Date.now(),
        cookies: cookies,
        localStorageItems: localStorageItems,
      },
    },
  };

  const res = await writeCookiesMap(accountInfo, cookiesMap);
  return [res, cookiesMap];
};

export const mergeAndWriteMultipleDomainCookies = async (
  cloudflareAccountInfo: AccountInfo,
  domainCookies: { domain: string; cookies: ICookie[]; localStorageItems: ILocalStorageItem[] }[],
  oldCookieMap: ICookiesMap = {},
): Promise<[WriteResponse, ICookiesMap]> => {
  await check(cloudflareAccountInfo);

  const newDomainCookieMap = {
    ...(oldCookieMap.domainCookieMap || {}),
  };
  for (const { domain, cookies, localStorageItems } of domainCookies) {
    newDomainCookieMap[domain] = {
      updateTime: Date.now(),
      createTime: oldCookieMap.domainCookieMap?.[domain]?.createTime || Date.now(),
      cookies: cookies,
      localStorageItems: localStorageItems || [],
    };
  }
  const cookiesMap: ICookiesMap = {
    updateTime: Date.now(),
    createTime: oldCookieMap?.createTime || Date.now(),
    domainCookieMap: newDomainCookieMap,
  };

  const res = await writeCookiesMap(cloudflareAccountInfo, cookiesMap);
  return [res, cookiesMap];
};

export const removeAndWriteCookies = async (
  cloudflareAccountInfo: AccountInfo,
  domain: string,
  oldCookieMap: ICookiesMap = {},
  id?: string,
): Promise<[WriteResponse, ICookiesMap]> => {
  await check(cloudflareAccountInfo);
  const cookiesMap: ICookiesMap = {
    updateTime: Date.now(),
    createTime: oldCookieMap?.createTime || Date.now(),
    domainCookieMap: {
      ...(oldCookieMap.domainCookieMap || {}),
    },
  };
  if (cookiesMap.domainCookieMap) {
    if (id !== undefined) {
      if (cookiesMap.domainCookieMap[domain]?.cookies) {
        const oldLength = cookiesMap.domainCookieMap[domain]?.cookies?.length || 0;
        cookiesMap.domainCookieMap[domain].cookies =
          cookiesMap.domainCookieMap[domain].cookies?.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (cookie: any) => `${cookie.domain}_${cookie.name}` !== id,
          ) || [];
        const newLength = cookiesMap.domainCookieMap[domain]?.cookies?.length || 0;
        if (oldLength === newLength) {
          throw new Error(`${id}: cookie not found`);
        }
      }
    } else {
      delete cookiesMap.domainCookieMap[domain];
    }
  }

  const res = await writeCookiesMap(cloudflareAccountInfo, cookiesMap);
  return [res, cookiesMap];
};

export const editAndWriteCookies = async (
  cloudflareAccountInfo: AccountInfo,
  host: string,
  oldCookieMap: ICookiesMap = {},
  oldItem: ICookie,
  newItem: ICookie,
): Promise<[WriteResponse, ICookiesMap]> => {
  await check(cloudflareAccountInfo);
  const cookiesMap: ICookiesMap = {
    updateTime: Date.now(),
    createTime: oldCookieMap?.createTime || Date.now(),
    domainCookieMap: {
      ...(oldCookieMap.domainCookieMap || {}),
    },
  };
  if (cookiesMap.domainCookieMap) {
    const cookieLength = cookiesMap.domainCookieMap[host]?.cookies?.length || 0;
    for (let i = 0; i < cookieLength; i++) {
      const cookieItem = cookiesMap.domainCookieMap[host]?.cookies?.[i];
      if (cookieItem?.name === oldItem.name && cookieItem?.domain === oldItem.domain) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (cookiesMap.domainCookieMap[host].cookies as any)[i] = {
          ...cookieItem,
          ...newItem,
        };
        break;
      }
    }
  }

  const res = await writeCookiesMap(cloudflareAccountInfo, cookiesMap);
  return [res, cookiesMap];
};
