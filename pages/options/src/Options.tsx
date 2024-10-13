import { useStorageSuspense, useTheme, withErrorBoundary, withSuspense } from '@sync-your-cookie/shared';
import { cloudflareStorage } from '@sync-your-cookie/storage';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  ThemeDropdown,
  Toaster,
} from '@sync-your-cookie/ui';
import { useState } from 'react';
import { toast } from 'sonner';

const Options = () => {
  const cloudflareAccountInfo = useStorageSuspense(cloudflareStorage);
  console.log('cloudflareAccountInfo', cloudflareAccountInfo);

  const [token, setToken] = useState(cloudflareAccountInfo.token);
  const [accountId, setAccountId] = useState(cloudflareAccountInfo.accountId);
  const [namespaceId, setNamespaceId] = useState(cloudflareAccountInfo.namespaceId);

  const { setTheme } = useTheme();

  const handleTokenInput: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setToken(evt.target.value);
  };

  const handleAccountInput: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setAccountId(evt.target.value);
  };

  const handleNamespaceInput: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setNamespaceId(evt.target.value);
  };

  const handleSave = () => {
    cloudflareStorage.update({
      accountId: accountId,
      namespaceId: namespaceId,
      token: token,
    });
    toast.success('Save Success');
  };

  return (
    <div className="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center p-4 bg-background ">
      <div className="fixed right-8 top-8 ">
        <ThemeDropdown setTheme={setTheme} />
      </div>
      <div className=" mt-[-80px] flex justify-center flex-col items-center">
        <img
          src={chrome.runtime.getURL('options/logo.png')}
          className="h-48 w-48 overflow-hidden object-contain mb-4 animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <div className="w-full">
          <Card className="mx-auto min-w-[400px] max-w-lg">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-xl">Settings</CardTitle>
              </div>
              <CardDescription>Enter your cloudflare account to store Cookie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex justify-between items-center ">
                    <Label htmlFor="token">Authorization Token</Label>
                  </div>
                  <Input
                    id="token"
                    value={token}
                    onChange={handleTokenInput}
                    className="w-full mb-2"
                    type="text"
                    placeholder="please input your cloudflare token "
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center ">
                    <Label htmlFor="accountId">Account ID</Label>
                  </div>
                  <Input
                    id="accountId"
                    value={accountId}
                    onChange={handleAccountInput}
                    className="w-full mb-2"
                    type="text"
                    placeholder="please input your cloudflare account ID "
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center ">
                    <Label htmlFor="namespaceId">Namespace ID</Label>
                    {namespaceId ? null : (
                      <div className="text-center ml-16 text-sm">
                        Don’t have an ID yet?
                        <span className=" cursor-pointer underline ml-2">Create</span>
                      </div>
                    )}
                  </div>
                  <Input
                    id="namespaceId"
                    value={namespaceId}
                    onChange={handleNamespaceInput}
                    className="w-full mb-4"
                    type="text"
                    placeholder="please input namespace ID "
                  />
                </div>

                <Button onClick={handleSave} type="submit" className="w-full">
                  Save
                </Button>
                <div className="text-center mt-4 text-sm">
                  Don’t have a cloudflare Account yet?
                  <a
                    href="https://dash.cloudflare.com/sign-up"
                    target="_blank"
                    className=" cursor-pointer underline ml-2"
                    rel="noreferrer">
                    Sign up
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-2 text-sm">
        Built by
        <a
          className="mx-0.5 font-bold text-primary "
          target="_blank"
          href="https://github.com/jackluson"
          rel="noreferrer">
          jackluson
        </a>
        . The source code is available on{' '}
        <a
          className="font-bold inline-flex items-center "
          href="https://github.com/jackluson/sync-your-cookie"
          target="_blank"
          rel="noopener noreferrer">
          GitHub
          <img
            src={chrome.runtime.getURL('popup/github.svg')}
            className="ml-1 h-4 w-4 overflow-hidden object-contain "
            alt="logo"
          />
        </a>
        .
      </div>

      <Toaster
        position="top-center"
        richColors
        visibleToasts={1}
        toastOptions={{
          duration: 2000,
        }}
      />
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
