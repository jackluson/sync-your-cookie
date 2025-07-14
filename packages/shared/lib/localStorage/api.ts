import { WriteResponse } from '../cloudflare/api';

const KV_KEY = 'syncyourcookie_localstorage';

export const writeLocalStorageCloudflareKV = async (value: string, accountId: string, namespaceId: string, token: string) => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${KV_KEY}`;
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: value,
  };
  console.log('writeLocalStorageCloudflareKV called with:', { url, hasValue: !!value, valueLength: value.length });
  
  return fetch(url, options).then(async res => {
    const result = await res.json();
    console.log('writeLocalStorageCloudflareKV response:', { status: res.status, result });
    return result;
  }).catch(err => {
    console.error('writeLocalStorageCloudflareKV error:', err);
    throw err;
  });
};

export const readLocalStorageCloudflareKV = async (accountId: string, namespaceId: string, token: string) => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${KV_KEY}`;
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  return fetch(url, options).then(async res => {
    if (res.status === 404) {
      return '';
    }
    if (res.status === 200) {
      const text = await res.text();
      return text.trim();
    } else {
      return Promise.reject(await res.json());
    }
  });
};