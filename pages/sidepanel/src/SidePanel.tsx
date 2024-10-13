import { withErrorBoundary, withSuspense } from '@sync-your-cookie/shared';
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

  return (
    <div className="">
      <header></header>
      <CookieTable />
    </div>
  );
};

export default withErrorBoundary(withSuspense(SidePanel, <div> Loading ... </div>), <div> Error Occur </div>);
