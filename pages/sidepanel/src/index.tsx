import '@src/index.css';
import SidePanel from '@src/SidePanel';
import { ThemeProvider } from '@sync-your-cookie/shared';
import '@sync-your-cookie/ui/css';
import { createRoot } from 'react-dom/client';

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(
    <ThemeProvider>
      <SidePanel />
    </ThemeProvider>,
  );
}

init();
