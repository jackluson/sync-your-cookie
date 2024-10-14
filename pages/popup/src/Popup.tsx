import {
  ErrorCode,
  pullAndSetCookies,
  pushCookies,
  useStorageSuspense,
  useTheme,
  withErrorBoundary,
  withSuspense,
} from '@sync-your-cookie/shared';
import { cloudflareStorage } from '@sync-your-cookie/storage';

import { Button, Spinner, Toaster } from '@sync-your-cookie/ui';
import { CloudDownload, CloudUpload, Copyright, PanelRightOpen, RotateCw, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';
import { AutoSwitch } from './components/AutoSwtich';
import { useDomainConfig } from './hooks/useDomainConfig';
import { extractDomain } from './utils';

const Popup = () => {
  const cloudflareAccountInfo = useStorageSuspense(cloudflareStorage);

  const { theme } = useTheme();
  const [activeTabUrl, setActiveTabUrl] = useState('');
  const {
    pushing,
    togglePullingState,
    togglePushingState,
    toggleAutoPushState,
    toggleAutoPullState,
    domain,
    setDomain,
    domainConfig,
  } = useDomainConfig();

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, async function (tabs) {
      console.log('tab in Popup', tabs);
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        if (activeTab.url && activeTab.url.startsWith('http')) {
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
    try {
      togglePushingState(true);
      await check();
      const cookies = await chrome.cookies.getAll({
        // url: activeTabUrl,
        domain: domain,
      });
      console.log('push->cookies', cookies);
      if (cookies) {
        const res = await pushCookies(domain, cookies);
        console.log(res);
        if (res.success) {
          toast.success('Pushed success');
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
    } finally {
      togglePushingState(false);
    }
  };

  const handlePull = async () => {
    try {
      togglePullingState(true);
      await check();
      const cookieMap = await pullAndSetCookies(activeTabUrl, domain);
      console.log('cookieMap in handlePull', cookieMap);
      toast.success('Pull success');
    } catch (error) {
      if ((error as Error)?.message) {
        toast.error((error as Error).message);
      }
    } finally {
      togglePullingState(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-w-[400px] justify-center bg-background ">
      <header className=" p-2 flex w-full justify-between items-center bg-card/50 shadow-md border-b border-border ">
        <div className="flex items-center">
          <img
            src={chrome.runtime.getURL('options/logo.png')}
            className="h-10 w-10 overflow-hidden object-contain "
            alt="logo"
          />
          <h2 className="text-base text-foreground	font-bold">SyncYourCookie</h2>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            chrome.runtime.openOptionsPage();
          }}
          className="cursor-pointer text-sm mr-[-8px] ">
          <Settings size={20} />
        </Button>
      </header>
      <main className="p-4 ">
        <Spinner show={false}>
          {domain ? (
            <h3 className=" mb-2 text-center whitespace-nowrap text-xl text-primary font-bold"> {domain}</h3>
          ) : null}

          <div className=" flex flex-col">
            {/* <Button title={cloudflareAccountId} className="mb-2" onClick={handleUpdateToken}>
            Update Token
          </Button> */}
            <div className="flex items-center mb-2 ">
              <Button
                disabled={!activeTabUrl || domainConfig?.pushing || pushing}
                className=" mr-2 w-[160px] justify-start"
                onClick={handlePush}>
                {domainConfig.pushing ? (
                  <RotateCw size={16} className="mr-2 animate-spin" />
                ) : (
                  <CloudUpload size={16} className="mr-2" />
                )}
                Push cookie
              </Button>
              <AutoSwitch
                disabled={!activeTabUrl}
                onChange={toggleAutoPushState}
                id="autoPush"
                value={!!domainConfig.autoPush}
              />
            </div>

            <div className="flex items-center mb-2 ">
              <Button
                disabled={!activeTabUrl || domainConfig.pulling}
                className=" w-[160px] mr-2 justify-start"
                onClick={handlePull}>
                {domainConfig.pulling ? (
                  <RotateCw size={16} className="mr-2 animate-spin" />
                ) : (
                  <CloudDownload size={16} className="mr-2" />
                )}
                Pull cookie
              </Button>

              <AutoSwitch
                disabled={!activeTabUrl}
                onChange={toggleAutoPullState}
                id="autoPull"
                value={!!domainConfig.autoPull}
              />
            </div>

            <Button
              className="mb-2 justify-start"
              onClick={async () => {
                chrome.windows.getCurrent(async currentWindow => {
                  // const res = await chrome.sidePanel.getOptions({
                  //   tabId: currentWindow.id,
                  // });
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
              duration: 1500,
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
      <footer className="w-full text-center justify-center p-4 flex items-center border-t border-border/90 ">
        <span>
          <Copyright size={16} />
        </span>
        <a
          className=" inline-flex items-center mx-1 text-sm underline "
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
