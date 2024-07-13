const DEFAULT_KEY = 'sync-your-cookie';

/**
 *
 * @param value specify the value to write
 * @param accountId cloudflare account id
 * @param namespaceId cloudflare namespace id
 * @param token api token
 * @returns promise<res>
 */
export const writeCloudflareKV = async (value: string, accountId: string, namespaceId: string, token: string) => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/bulk`;
  const payload = [
    {
      key: DEFAULT_KEY,
      metadata: {
        someMetadataKey: value,
      },
      value: value,
    },
  ];
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  };
  return fetch(url, options).then(res => res.json());
};

/**
 *
 * @param accountId cloudflare account id
 * @param namespaceId cloudflare namespace id
 * @param token api token
 * @returns Promise<res>
 */
export const readCloudflareKV = async (accountId: string, namespaceId: string, token: string) => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${DEFAULT_KEY}`;
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  return fetch(url, options).then(async res => {
    const text = await res.text();
    return text;
  });
};
