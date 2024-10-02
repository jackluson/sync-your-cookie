import { useStorageSuspense, withErrorBoundary, withSuspense } from '@sync-your-cookie/shared';
import { cloudflareAccoutIdStorage, themeStorage } from '@sync-your-cookie/storage';
import { Alert, AlertDescription, AlertTitle, Button, Input, Toaster } from '@sync-your-cookie/ui';
import { ComponentPropsWithoutRef, useState } from 'react';

const Options = () => {
  const theme = useStorageSuspense(themeStorage);
  const cloudfareAccountId = useStorageSuspense(cloudflareAccoutIdStorage);

  const [accountId, setAccountId] = useState(cloudfareAccountId);
  // const { setTheme } = useTheme();

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = evt => {
    console.log('handleInput', evt.target.value);
    setAccountId(evt.target.value);
  };

  const handleSave = () => {
    console.log('handleSave', accountId);
    cloudflareAccoutIdStorage.set(accountId);
  };

  return (
    <div className="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center p-4 bg-background ">
      <div className="flex justify-center flex-col items-center">
        <img
          src={chrome.runtime.getURL('options/logo.png')}
          className="h-40 w-40 overflow-hidden object-contain mb-4 animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <div className="w-full">
          <Input
            value={accountId}
            onChange={handleInput}
            className="w-full mb-4"
            type="text"
            placeholder="please input your cloudflare account ID "
          />
          <Button onClick={handleSave}>Save</Button>
        </div>
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
      <Toaster />
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
