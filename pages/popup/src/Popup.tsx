import {
  arrayBufferToBase64,
  decodeDomainCookies,
  encodeDomainCookies,
  useStorageSuspense,
  withErrorBoundary,
  withSuspense,
} from '@chrome-extension-boilerplate/shared';
import { cloudflareAccoutIdStore, exampleThemeStorage } from '@chrome-extension-boilerplate/storage';
import '@src/Popup.css';
import { Button } from '@src/components/ui/button';
import { ComponentPropsWithoutRef, useEffect, useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { writeCloudflareKV } from './utils/cloudflare';

const Popup = () => {
  const theme = useStorageSuspense(exampleThemeStorage);
  const cloudfareAccountId = useStorageSuspense(cloudflareAccoutIdStore);

  const { setTheme } = useTheme();
  const [hostname, setHostname] = useState('');
  const [activeTabUrl, setActiveTabUrl] = useState('');

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
      console.log('tab', tabs);
      if (tabs.length > 0) {
        const activeTab = tabs[0];
        if (activeTab.url) {
          console.log('actieTab', activeTab.url, new URL(activeTab.url));
          setActiveTabUrl(activeTab.url);
          setHostname(new URL(activeTab.url).host);
        }
      }
    });
  }, []);
  async function concatUint8Arrays(uint8arrays: ArrayBuffer[]) {
    const blob = new Blob(uint8arrays);
    const buffer = await blob.arrayBuffer();
    return new Uint8Array(buffer);
  }

  /**
   * Decompress bytes into a UTF-8 string.
   *
   * @param {Uint8Array} compressedBytes
   * @returns {Promise<string>}
   */
  async function decompress(compressedBytes: ArrayBuffer) {
    // Convert the bytes to a stream.
    const stream = new Blob([compressedBytes]).stream();

    // Create a decompressed stream.
    const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip')) as unknown as ArrayBuffer[];

    // Read all the bytes from this stream.
    const chunks = [];
    for await (const chunk of decompressedStream) {
      chunks.push(chunk);
    }
    const stringBytes = await concatUint8Arrays(chunks);
    return stringBytes;
  }

  const handleUpload = () => {
    console.log('handle load');
    console.log('hostname', hostname);

    chrome.cookies.getAll(
      {
        url: activeTabUrl,
      },
      async cookies => {
        console.log('cookies', cookies);
        if (cookies) {
          const compressRes = await encodeDomainCookies(cookies);
          console.log('compressRes', compressRes);
          const accoundId = 'e0a55339ba8e15b97db21d0f9d80a255';
          const namespaceId = '8181fed01e874d25be35da06564df74f';
          const token = 'e3st0CUmtGr-DdTC7kuKxYhQgFpi6ZnxOSQcdr2N';
          const base64Str = arrayBufferToBase64(compressRes);
          writeCloudflareKV(base64Str, accoundId, namespaceId, token)
            .then(async json => {
              console.log(json);
              // const value = await readCloudflareKV(accoundId, namespaceId, token)
              // console.log("value", value);
              // const buffer = base64ToArrayBuffer(value);
              // console.log("base64Str-> res", base64Str);
              // const output = pako.ungzip(buffer);
              // console.log("output", output, output.length, );
              // var decode = decodeMessage(output);
              // console.log("decode", decode);
            })
            .catch(err => console.error('error:' + err));
          // console.log('buf', buf);
          // const pokoOutput = pako.deflate(buf);
          // console.log('pokoOutput', pokoOutput, pokoOutput.length);
          // const pokoOutputGzip = pako.gzip(buf);
          // console.log('pokoOutputGzip', pokoOutputGzip, pokoOutputGzip.length);
          // const rawStr = new TextDecoder().decode(pokoOutput);
          // console.log('rawStr', rawStr, rawStr.length);
          // const compressRes = await compress(pokoOutput);
          // console.log('compressRes', compressRes);

          // console.log('base64Str-》', base64Str, base64Str.length);
          // const compressStr = new TextDecoder().decode(compressRes);
          // console.log('compressStr', compressStr, compressStr.length);
          // const pakoDecomressBuffer = decodeDomainCookies(compressRes);
          // console.log('pakoDecomressBuffer', pakoDecomressBuffer);
          // const deCompressResStr = new TextDecoder().decode(pakoDecomressBuffer);
          // console.log('deCompressResStr', deCompressResStr, deCompressResStr.length);
          const deMsg = await decodeDomainCookies(compressRes);
          console.log('deMsg', deMsg);
        }
      },
    );

    console.log('cloudfareAccountId', cloudfareAccountId);
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
        <Button className="mb-2" onClick={handleUpload}>
          上传cookie
        </Button>
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
