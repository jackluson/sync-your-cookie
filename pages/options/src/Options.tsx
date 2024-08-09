import '@src/Options.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@sync-your-cookie/shared';
import { themeStorage } from '@sync-your-cookie/storage';
import { ComponentPropsWithoutRef } from 'react';

const Options = () => {
  const theme = useStorageSuspense(themeStorage);

  return (
    <div
      className="App-container"
      style={{
        backgroundColor: theme === 'light' ? '#eee' : '#222',
      }}>
      <img src={chrome.runtime.getURL('options/logo.svg')} className="App-logo" alt="logo" />
      <span style={{ color: theme === 'light' ? '#0281dc' : undefined, marginBottom: '10px' }}>Options</span>
      Edit <code>pages/options/src/Options.tsx</code> and save to reload.
      <ToggleButton>Toggle theme</ToggleButton>
    </div>
  );
};

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorageSuspense(themeStorage);
  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (theme === 'light' ? 'bg-white text-black' : 'bg-black text-white')
      }
      onClick={themeStorage.toggle}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
