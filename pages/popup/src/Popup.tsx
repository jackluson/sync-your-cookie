import {
  ErrorCode,
  mergeAndWriteCookies,
  pullCookies,
  useStorageSuspense,
  useTheme,
  withErrorBoundary,
  withSuspense,
} from '@sync-your-cookie/shared';
import { cloudflareStorage, cookieStorage } from '@sync-your-cookie/storage';

import { Button, Spinner, Toaster } from '@sync-your-cookie/ui';
import { CloudDownload, CloudUpload, Copyright, PanelRightOpen, RotateCw, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';
import { AutoSwitch } from './components/AutoSwtich';
import { extractDomain } from './utils';

const Popup = () => {
  const cloudflareAccountInfo = useStorageSuspense(cloudflareStorage);
  const cookieInfo = useStorageSuspense(cookieStorage);

  console.log('cookieInfo', cookieInfo, cookieInfo);
  const { theme } = useTheme();
  const [domain, setDomain] = useState('');
  const [activeTabUrl, setActiveTabUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, async function (tabs) {
      console.log('tab', tabs);
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        if (activeTab.url && activeTab.url.startsWith('http')) {
          console.log('actieTab', activeTab.url, new URL(activeTab.url));
          setActiveTabUrl(activeTab.url);
          const domain = await extractDomain(activeTab.url);
          setDomain(domain);
        }
      }
    });
    // fetchCookies(true);
    const handler = (changeInfo: chrome.cookies.CookieChangeInfo) => {
      console.log('changeInfo', changeInfo);
    };

    chrome.cookies?.onChanged.addListener(handler);
    return () => {
      chrome.cookies?.onChanged.removeListener(handler);
    };
  }, []);

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
    console.log('hostname', domain);
    console.log('exist cookies', await cookieStorage.get(), cookieInfo);
    await check();

    chrome.cookies.getAll(
      {
        url: activeTabUrl,
        domain: domain,
        path: '/',
      },
      async cookies => {
        console.log('push->cookies', cookies);
        if (cookies) {
          const [res, newCookiesMap] = await mergeAndWriteCookies(cloudflareAccountInfo, domain, cookies, cookieInfo);
          // const accoundId = 'e0a55339ba8e15b97db21d0f9d80a255';
          // const namespaceId = '8181fed01e874d25be35da06564df74f';
          // const token = 'e3st0CUmtGr-DdTC7kuKxYhQgFpi6ZnxOSQcdr2N';
          console.log(res);
          if (res.success) {
            toast.success('Pushed success');
            cookieStorage.update(newCookiesMap);
          } else {
            console.log('json.errors[0]', res.errors[0]);
            if (res.errors?.length && res.errors[0].code === ErrorCode.NotFoundRoute) {
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
        }
      },
    );

    // chrome.tts.speak('Hello, world.', (res)=> {
    //   console.log("res", res);
    //   console.log('done')

    // });
  };

  const handlePull = async () => {
    await check();
    const cookieMap = await pullCookies();
    console.log('cookieMap', cookieMap);
    const cookieDetails = cookieMap.domainCookieMap?.[domain]?.cookies || [];
    if (cookieDetails.length === 0) {
      toast.error('No cookies to pull, push first please');
    } else {
      for (const cookie of cookieDetails) {
        if (cookie.domain?.includes(domain)) {
          chrome.cookies.set({ ...cookie, url: activeTabUrl } as chrome.cookies.SetDetails, res => {
            console.log('set cookie', res);
          });
        }
      }
    }
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
          {domain ? (
            <h3 className=" mb-2 text-center whitespace-nowrap text-xl text-primary font-bold"> {domain}</h3>
          ) : null}

          <div className=" flex flex-col">
            {/* <Button title={cloudflareAccountId} className="mb-2" onClick={handleUpdateToken}>
            Update Token
          </Button> */}
            <div className="flex items-center mb-2 ">
              <Button disabled={!activeTabUrl} className=" mr-2 w-[160px] justify-start" onClick={handlePush}>
                <CloudUpload size={16} className="mr-2" />
                Push cookie
              </Button>
              <AutoSwitch />
            </div>

            <div className="flex items-center mb-2 ">
              <Button
                disabled={!activeTabUrl || loading}
                className=" w-[160px] mr-2 justify-start"
                onClick={handlePull}>
                {loading ? (
                  <RotateCw size={16} className="mr-2 animate-spin" />
                ) : (
                  <CloudDownload size={16} className="mr-2" />
                )}
                Pull cookie
              </Button>
              <AutoSwitch />
            </div>

            <Button
              className="mb-2 justify-start"
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
              <PanelRightOpen size={16} className="mr-2" />
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
