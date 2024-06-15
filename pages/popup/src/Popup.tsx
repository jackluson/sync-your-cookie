import { useStorageSuspense, withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { cloudflareAccoutIdStore, exampleThemeStorage } from '@chrome-extension-boilerplate/storage';
import '@src/Popup.css';
import { Button } from '@src/components/ui/button';
import { ComponentPropsWithoutRef, useEffect, useState } from 'react';
import { useTheme } from './hooks/useTheme';

const Popup = () => {
  const theme = useStorageSuspense(exampleThemeStorage);
  const cloudfareAccountId = useStorageSuspense(cloudflareAccoutIdStore);

  console.log('cloudfareAccountId', cloudfareAccountId);
  const { setTheme } = useTheme();
  const [hostname, setHostname] = useState('');

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
      console.log('tabs', tabs);
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        if (activeTab.url) {
          console.log('activeTab', activeTab.url, new URL(activeTab.url));
          setHostname(new URL(activeTab.url).host);
        }
      }
    });
  }, []);

  const handleUpload = () => {
    console.log('handle load');
    // chrome.tts.speak('Hello, world.', (res)=> {
    //   console.log("res", res);
    //   console.log('done')

    // });
  };

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center p-4 bg-background "
      // style={{
      //   backgroundColor: theme === 'light' ? '#eee' : '#222',
      // }}
    >
      <h3 className="text-xl text-primary font-bold">{hostname}</h3>
      <header className="App-header" style={{ color: theme === 'light' ? '#222' : '#eee' }}>
        {/* <img src={chrome.runtime.getURL('popup/logo.svg')} className="App-logo" alt="logo" /> */}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: theme === 'light' ? '#0281dc' : undefined, marginBottom: '10px' }}>
          Learn React!
        </a>
        <Button onClick={handleUpload}>Click me</Button>
        <Button
          onClick={() => {
            setTheme('dark');
          }}>
          Click me
        </Button>
        <Button
          onClick={() => {
            setTheme('light');
          }}>
          Click me
        </Button>
        <ToggleButton>Toggle theme ~</ToggleButton>
      </header>
    </div>
  );
};

const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
  const theme = useStorageSuspense(exampleThemeStorage);
  return (
    <button
      className={
        props.className +
        ' ' +
        'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
        (theme === 'light' ? 'bg-white text-black' : 'bg-black text-white')
      }
      onClick={exampleThemeStorage.toggle}>
      {props.children}
    </button>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
