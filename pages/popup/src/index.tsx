import { ThemeProvider } from '@chrome-extension-boilerplate/shared';
import '@chrome-extension-boilerplate/ui/css';
import Popup from '@src/Popup';
import '@src/index.css';
import { createRoot } from 'react-dom/client';

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);

  root.render(
    <ThemeProvider>
      <Popup />
    </ThemeProvider>,
  );
}

init();
