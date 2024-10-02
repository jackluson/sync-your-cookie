import { useStorageSuspense, useTheme, withErrorBoundary, withSuspense } from '@sync-your-cookie/shared';
import { cloudflareAccoutIdStorage, themeStorage } from '@sync-your-cookie/storage';
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

const Options = () => {
  const theme = useStorageSuspense(themeStorage);
  const cloudfareAccountId = useStorageSuspense(cloudflareAccoutIdStorage);

  const [accountId, setAccountId] = useState(cloudfareAccountId);
  const [namespaceId, setNamespaceId] = useState(cloudfareAccountId);

  const { setTheme } = useTheme();

  const handleAccountInput: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setAccountId(evt.target.value);
  };

  const handleNamespaceInput: React.ChangeEventHandler<HTMLInputElement> = evt => {
    console.log('handleInput', evt.target.value);
    setNamespaceId(evt.target.value);
  };

  const handleSave = () => {
    console.log('handleSave', accountId);
    cloudflareAccoutIdStorage.set(accountId);
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
          <Card className="mx-auto max-w-lg">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-xl">Settings</CardTitle>
              </div>
              <CardDescription>Enter your cloudfare account to store Cookie</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="accountId">Account ID</Label>
                  <Input
                    id="accountId"
                    value={accountId}
                    onChange={handleAccountInput}
                    className="w-full mb-4"
                    type="text"
                    placeholder="please input your cloudflare account ID "
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center ">
                    <Label htmlFor="namespaceId">Namespace ID</Label>
                    <div className="text-center ml-16 text-sm">
                      Don’t have an ID yet?
                      <span className=" cursor-pointer underline ml-2">Create</span>
                    </div>
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
                {/* <Button variant="outline" className="w-full">
                  Sign up with GitHub
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
