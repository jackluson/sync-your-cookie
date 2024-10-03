import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  decodeDomainCookies,
  encodeDomainCookies,
  ICookie,
} from '@sync-your-cookie/protobuf';

import {
  ErrorCode,
  readCloudflareKV,
  useStorageSuspense,
  withErrorBoundary,
  withSuspense,
  writeCloudflareKV,
} from '@sync-your-cookie/shared';
import {
  cloudflareAccountIdStorage,
  cloudflareNamespaceIdStorage,
  cloudflareTokenStorage,
} from '@sync-your-cookie/storage';
import { Button, Spinner, Toaster } from '@sync-your-cookie/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTheme } from './hooks/useTheme';

const Popup = () => {
  const cloudflareAccountId = useStorageSuspense(cloudflareAccountIdStorage);
  const cloudflareNamespaceId = useStorageSuspense(cloudflareNamespaceIdStorage);
  const cloudflareToken = useStorageSuspense(cloudflareTokenStorage);

  const { theme } = useTheme();
  const [hostname, setHostname] = useState('');
  const [activeTabUrl, setActiveTabUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
      console.log('tab', tabs);
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        if (activeTab.url && activeTab.url.startsWith('http')) {
          console.log('actieTab', activeTab.url, new URL(activeTab.url));
          setActiveTabUrl(activeTab.url);
          setHostname(new URL(activeTab.url).host);
        }
      }
    });
    fetchCookies();
  }, []);

  const fetchCookies = async () => {
    let cookieDetails: ICookie[] = [];
    try {
      setLoading(true);
      const token = 'e3st0CUmtGr-DdTC7kuKxYhQgFpi6ZnxOSQcdr2N';
      const res = await readCloudflareKV(cloudflareAccountId, cloudflareNamespaceId, token);
      console.log('res', res);
      const compressedBuffer = base64ToArrayBuffer(res);
      const deMsg = await decodeDomainCookies(compressedBuffer);
      console.log('deMsg', deMsg);
      const cookies = deMsg.cookies;
      cookieDetails = cookies.map(cookie => {
        return {
          domain: cookie.domain ?? undefined,
          expirationDate: cookie.expirationDate ?? undefined,
          httpOnly: cookie.httpOnly ?? undefined,
          name: cookie.name ?? undefined,
          // partitionKey: cookie.storeId,
          path: cookie.path ?? undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          sameSite: cookie.sameSite ?? ('lax' as any),
          secure: cookie.secure ?? undefined,
          storeId: cookie.storeId ?? undefined,
          value: cookie.value ?? undefined,
          url: activeTabUrl,
        };
      });
      console.log('pull cookiesDetail-》', cookieDetails);
      return cookieDetails;
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
    return cookieDetails;
  };

  const check = () => {
    if (!cloudflareAccountId) {
      toast.error('Account ID is empty', {
        // description: 'Please set cloudflare account id',
        action: {
          label: 'go to settings',
          onClick: () => {
            chrome.runtime.openOptionsPage();
          },
        },
        position: 'top-right',
      });
      throw new Error('Please set cloudflare account ID');
    }
    if (!cloudflareNamespaceId) {
      toast.error('NamespaceId ID is empty', {
        // description: 'Please set cloudflare namespace ID',
        action: {
          label: 'go to settings',
          onClick: () => {
            chrome.runtime.openOptionsPage();
          },
        },
        position: 'top-right',
      });
      throw new Error('Please set cloudflare namespace ID');
    }
  };

  const handlePush = async () => {
    console.log('handle load');
    console.log('hostname', hostname);
    await check();

    chrome.cookies.getAll(
      {
        url: activeTabUrl,
      },
      async cookies => {
        console.log('push->cookies', cookies);
        if (cookies) {
          const compressRes = await encodeDomainCookies(cookies);
          console.log('compressRes', compressRes);
          // const accoundId = 'e0a55339ba8e15b97db21d0f9d80a255';
          // const namespaceId = '8181fed01e874d25be35da06564df74f';
          // const token = 'e3st0CUmtGr-DdTC7kuKxYhQgFpi6ZnxOSQcdr2N';
          const base64Str = arrayBufferToBase64(compressRes);
          console.log('writeCloudflareKV', writeCloudflareKV);
          writeCloudflareKV(base64Str, cloudflareAccountId, cloudflareNamespaceId, cloudflareToken)
            .then(async json => {
              console.log(json);
              if (json.success) {
                toast.success('Pushed success');
              } else {
                console.log('json.errors[0]', json.errors[0]);
                if (json.errors?.length && json.errors[0].code === ErrorCode.NotFoundRoute) {
                  toast.error('cloudflare account info is incorrect', {
                    action: {
                      label: 'go to settings',
                      onClick: () => {
                        chrome.runtime.openOptionsPage();
                      },
                    },
                  });
                } else {
                  toast.error('Pushed fail');
                }
              }
              // const value = await readCloudflareKV(accoundId, namespaceId, token)
              // console.log("value", value);
              // const buffer = base64ToArrayBuffer(value);
              // console.log("base64Str-> res", base64Str);
              // const output = pako.ungzip(buffer);
              // console.log("output", output, output.length, );
              // var decode = decodeMessage(output);
              // console.log("decode", decode);
            })
            .catch(err => console.error('error:' + err));
          // console.log('buf', buf);
          // const pokoOutput = pako.deflate(buf);
          // console.log('pokoOutput', pokoOutput, pokoOutput.length);
          // const pokoOutputGzip = pako.gzip(buf);
          // console.log('pokoOutputGzip', pokoOutputGzip, pokoOutputGzip.length);
          // const rawStr = new TextDecoder().decode(pokoOutput);
          // console.log('rawStr', rawStr, rawStr.length);
          // const compressRes = await compress(pokoOutput);
          // console.log('compressRes', compressRes);

          // console.log('base64Str-》', base64Str, base64Str.length);
          // const compressStr = new TextDecoder().decode(compressRes);
          // console.log('compressStr', compressStr, compressStr.length);
          // const pakoDecomressBuffer = decodeDomainCookies(compressRes);
          // console.log('pakoDecomressBuffer', pakoDecomressBuffer);
          // const deCompressResStr = new TextDecoder().decode(pakoDecomressBuffer);
          // console.log('deCompressResStr', deCompressResStr, deCompressResStr.length);
        }
      },
    );

    // chrome.tts.speak('Hello, world.', (res)=> {
    //   console.log("res", res);
    //   console.log('done')

    // });
  };

  const handlePull = async () => {
    const cookieDetails = await fetchCookies();
    for (const cookies of cookieDetails) {
      chrome.cookies.set(cookies, res => {
        console.log('set cookie', res);
      });
    }
  };

  const handleUpdateToken = () => {
    cloudflareAccountIdStorage.set('e0a55339ba8e15b97db21d0f9d80a255');
  };

  return (
    <div
      className="flex flex-col items-center min-w-[400px] justify-center p-4 bg-background "
      // style={{
      //   backgroundColor: theme === 'light' ? '#eee' : '#222',
      // }}
    >
      <Spinner show={loading}>
        {hostname ? <h3 className=" whitespace-nowrap my-4 text-xl text-primary font-bold"> {hostname}</h3> : null}

        <div className="flex flex-col">
          {/* <img src={chrome.runtime.getURL('popup/logo.svg')} className="App-logo" alt="logo" /> */}
          <Button title={cloudflareAccountId} className="mb-2" onClick={handleUpdateToken}>
            Update Token
          </Button>
          <Button disabled={!activeTabUrl} className="mb-2" onClick={handlePush}>
            Push cookie
          </Button>
          <Button disabled={!activeTabUrl} className="mb-2" onClick={handlePull}>
            Pull cookie
          </Button>
        </div>
        <Toaster
          theme={theme}
          closeButton
          toastOptions={{
            duration: 2000,
            style: {
              // width: 'max-content',
              // margin: '0 auto',
            },
            // className: 'w-[240px]',
          }}
          visibleToasts={1}
          richColors
          position="top-center"
        />
      </Spinner>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
