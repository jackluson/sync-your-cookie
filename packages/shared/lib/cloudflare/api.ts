const DEFAULT_KEY = 'sync-your-cookie';

export interface WriteResponse {
  success: boolean;
  errors: {
    code: number;
    message: string;
  }[];
}

/**
 *
 * @param value specify the value to write
 * @param accountId cloudflare account id
 * @param namespaceId cloudflare namespace id
 * @param token api token
 * @returns promise<res>
 */
export const writeCloudflareKV = async (value: string, accountId: string, namespaceId: string, token: string) => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values/${DEFAULT_KEY}`;
  // const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/bulk`;
  // const payload = [
  //   {
  //     key: DEFAULT_KEY,
  //     metadata: JSON.stringify({
  //       someMetadataKey: value,
  //     }),
  //     value: value,
  //   },
  // ];
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: value,
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
