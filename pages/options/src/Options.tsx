import '@src/Options.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@sync-your-cookie/shared';
import { themeStorage } from '@sync-your-cookie/storage';
import { Alert, AlertDescription, AlertTitle, Input } from '@sync-your-cookie/ui';
import { ComponentPropsWithoutRef } from 'react';

const Options = () => {
  const theme = useStorageSuspense(themeStorage);
  // const { setTheme } = useTheme();

  return (
    <div className="App-container absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center p-4 bg-background ">
      <img src={chrome.runtime.getURL('options/logo.png')} className="App-logo" alt="logo" />
      <Input type="text" placeholder="cloudfareAccountId" />
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>You can add components to your app using the cli.</AlertDescription>
      </Alert>
      {/* <Button
        onClick={() => {
          setTheme('dark');
        }}>
        Click me to dark
      </Button> */}
      {/* <Button
        onClick={() => {
          setTheme('light');
        }}>
        Click me to light
      </Button> */}
      <span style={{ color: theme === 'light' ? '#0281dc' : undefined, marginBottom: '10px' }}>Options</span>
      Edit <code>pages/options/src/Oions.tsx</code> and save to reload.
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
