import { useTheme, withErrorBoundary, withSuspense } from '@sync-your-cookie/shared';
import { Toaster } from '@sync-your-cookie/ui';
import { useEffect } from 'react';
import CookieTable from './components/CookieTable';
const SidePanel = () => {
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
      <header></header>
      <CookieTable />
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
