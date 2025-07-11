import { useTheme, withErrorBoundary, withSuspense } from '@sync-your-cookie/shared';
import { Button, Toaster } from '@sync-your-cookie/ui';
import { useEffect, useState } from 'react';
import CookieTable from './components/CookieTable';
import LocalStorageTable from './components/LocalStorageTable';
const SidePanel = () => {
  const [activeTab, setActiveTab] = useState('cookies');
  
  useEffect(() => {
    chrome.runtime.onMessage.addListener(message => {
      // Might not be as easy if there are multiple side panels open
      if (message === 'closeSidePanel') {
        window.close();
      }
    });
  }, []);
  const { theme } = useTheme();

  return (
    <div className="">
      <header>
        <div className="flex border-b border-border mx-4 mb-4">
          <Button
            variant={activeTab === 'cookies' ? 'default' : 'ghost'}
            className="flex-1"
            onClick={() => setActiveTab('cookies')}
          >
            Cookies
          </Button>
          <Button
            variant={activeTab === 'localStorage' ? 'default' : 'ghost'}
            className="flex-1"
            onClick={() => setActiveTab('localStorage')}
          >
            LocalStorage
          </Button>
        </div>
      </header>
      
      {activeTab === 'cookies' && <CookieTable />}
      {activeTab === 'localStorage' && <LocalStorageTable />}
      
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
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
