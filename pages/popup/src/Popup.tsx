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
  useTheme,
  withErrorBoundary,
  withSuspense,
  writeCloudflareKV,
} from '@sync-your-cookie/shared';
import { cloudflareStorage, cookieStorage } from '@sync-your-cookie/storage';

import { Button, Spinner, Toaster } from '@sync-your-cookie/ui';
import { Copyright, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';
import { extractDomain } from './utils';

const Popup = () => {
  const cloudflareAccountInfo = useStorageSuspense(cloudflareStorage);
  const cookieInfo = useStorageSuspense(cookieStorage);

  console.log('cookieInfo', cookieInfo);
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
          const domain = extractDomain(new URL(activeTab.url).host);
          setHostname(domain);
        }
      }
    });
    fetchCookies(true);
  }, []);

  const fetchCookies = async (isSilent = false) => {
    let cookieDetails: ICookie[] = [];
    await check({ isSilent });
    try {
      setLoading(true);
      const res = await readCloudflareKV(
        cloudflareAccountInfo.accountId!,
        cloudflareAccountInfo.namespaceId!,
        cloudflareAccountInfo.token!,
      );
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

  const check = ({ isSilent = false } = {}) => {
    if (!cloudflareAccountInfo.accountId || !cloudflareAccountInfo.namespaceId || !cloudflareAccountInfo.token) {
      let message = 'Account ID is empty';
      if (!cloudflareAccountInfo.namespaceId) {
        message = 'NamespaceId ID is empty';
      } else if (!cloudflareAccountInfo.token) {
        message = 'Token is empty';
      }
      if (isSilent === false) {
        toast.error(message, {
          // description: 'Please set cloudflare account id',
          action: {
            label: 'go to settings',
            onClick: () => {
              chrome.runtime.openOptionsPage();
            },
          },
          position: 'top-right',
        });
      }

      throw new Error('Please set cloudflare account correctly');
    }
  };

  const handlePush = async () => {
    console.log('handle load');
    console.log('hostname', hostname);
    console.log('exist cookies', await cookieStorage.get(), cookieInfo);
    await check();

    chrome.cookies.getAll(
      {
        url: activeTabUrl,
      },
      async cookies => {
        console.log('push->cookies', cookies);
        if (cookies) {
          const existOtherDomainCookies = cookieInfo.list.filter(cookie => !cookie.domain?.includes(hostname));
          const mergeCookies = [...existOtherDomainCookies, ...cookies];
          console.log('mergeCookies', mergeCookies);
          const compressRes = await encodeDomainCookies(mergeCookies);
          // const accoundId = 'e0a55339ba8e15b97db21d0f9d80a255';
          // const namespaceId = '8181fed01e874d25be35da06564df74f';
          // const token = 'e3st0CUmtGr-DdTC7kuKxYhQgFpi6ZnxOSQcdr2N';
          const base64Str = arrayBufferToBase64(compressRes);
          console.log('writeCloudflareKV', writeCloudflareKV);
          writeCloudflareKV(
            base64Str,
            cloudflareAccountInfo.accountId!,
            cloudflareAccountInfo.namespaceId!,
            cloudflareAccountInfo.token!,
          )
            .then(async json => {
              console.log(json);
              if (json.success) {
                toast.success('Pushed success');
                cookieStorage.update({ list: mergeCookies });
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
    for (const cookie of cookieDetails) {
      if (cookie.domain?.includes(hostname)) {
        chrome.cookies.set({ ...cookie, url: activeTabUrl } as chrome.cookies.SetDetails, res => {
          console.log('set cookie', res);
        });
      }
    }
    cookieStorage.update({ list: cookieDetails });
  };

  return (
    <div className="flex flex-col items-center min-w-[400px] justify-center bg-background ">
      <header className=" p-2 flex w-full justify-between items-center bg-slate-50/50 shadow-md border-b border-gray-200 ">
        <div className="flex items-center">
          <img
            src={chrome.runtime.getURL('options/logo.png')}
            className="h-10 w-10 overflow-hidden object-contain "
            alt="logo"
          />
          <h2 className="text-base text-slate-700	 font-bold">SyncYourCookie</h2>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            chrome.runtime.openOptionsPage();
          }}
          className="cursor-pointer text-sm text-slate-700 mr-[-8px] ">
          <Settings size={20} />
        </Button>
      </header>
      <main className="p-4 ">
        <Spinner show={loading}>
          {hostname ? <h3 className=" whitespace-nowrap my-4 text-xl text-primary font-bold"> {hostname}</h3> : null}

          <div className=" flex flex-col">
            {/* <Button title={cloudflareAccountId} className="mb-2" onClick={handleUpdateToken}>
            Update Token
          </Button> */}
            <Button disabled={!activeTabUrl} className="mb-2" onClick={handlePush}>
              Push cookie
            </Button>
            <Button disabled={!activeTabUrl} className="mb-2" onClick={handlePull}>
              Pull cookie
            </Button>
            <Button
              className="mb-2"
              onClick={async () => {
                // const tab = await chrome.tabs.getCurrent();
                // console.log('tab', tab);
                chrome.windows.getCurrent(async currentWindow => {
                  console.log('currentWindow', currentWindow);
                  const res = await chrome.sidePanel.getOptions({
                    tabId: currentWindow.id,
                  });
                  console.log('res', res);
                  chrome.sidePanel
                    .open({ windowId: currentWindow.id! })
                    .then(() => {
                      console.log('Side panel opened successfully');
                    })
                    .catch(error => {
                      console.error('Error opening side panel:', error);
                    });
                });
              }}>
              Open Manager
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
      </main>
      <footer className="w-full text-center justify-center p-4 flex items-center border-t border-gray-200 ">
        <span>
          <Copyright size={16} />
        </span>
        <a
          className=" inline-flex items-center mx-1 text-sm underline"
          href="https://github.com/jackluson"
          target="_blank"
          rel="noopener noreferrer">
          jackluson
        </a>
        <a href="https://github.com/jackluson/sync-your-cookie" target="_blank" rel="noopener noreferrer">
          <img
            src={chrome.runtime.getURL('popup/github.svg')}
            className="h-4 w-4 overflow-hidden object-contain "
            alt="logo"
          />
        </a>
      </footer>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
