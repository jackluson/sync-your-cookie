import { ThemeProvider } from '@sync-your-cookie/shared';
import { createRoot } from 'react-dom/client';

import '@src/index.css';
import Options from '@src/Options';

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(
    <ThemeProvider>
      <Options />
    </ThemeProvider>,
  );
}

init();
