import { useStorageSuspense, useTheme, withErrorBoundary, withSuspense } from '@sync-your-cookie/shared';
import { accountStorage } from '@sync-your-cookie/storage/lib/accountStorage';
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
import { Eye, EyeOff, SlidersVertical } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { SettingsPopover } from './components/SettingsPopover';
import { useGithub } from './hooks/useGithub';

const Options = () => {
  const accountInfo = useStorageSuspense(accountStorage);
  console.log('cloudflareAccountInfo', accountInfo);
  const [token, setToken] = useState(accountInfo.token);
  const [accountId, setAccountId] = useState(accountInfo.accountId);
  const [namespaceId, setNamespaceId] = useState(accountInfo.namespaceId);
  const [openEye, setOpenEye] = useState(false);
  const { loading, handleLaunchAuth } = useGithub();

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
    accountStorage.update({
      accountId: accountId,
      namespaceId: namespaceId,
      token: token,
    });
    toast.success('Save Success');
  };

  const handleToggleEye = () => {
    setOpenEye(!openEye);
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
            <CardHeader className="relative">
              <div className="flex justify-between">
                <CardTitle className="text-xl">Settings</CardTitle>
              </div>
              <CardDescription>Enter your account to store Cookie</CardDescription>
              <SettingsPopover
                trigger={
                  <Button variant="secondary" size="icon" className="size-6 absolute right-4 top-4">
                    <SlidersVertical size={18} />
                  </Button>
                }
              />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex justify-between items-center ">
                    <Label htmlFor="token">Authorization Token</Label>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => handleToggleEye()}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleToggleEye();
                        }
                      }}
                      className="cursor-pointer">
                      {openEye ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>
                  <Input
                    id="token"
                    value={token}
                    onChange={handleTokenInput}
                    className="w-full mb-2"
                    type={openEye ? 'text' : 'password'}
                    placeholder="please input your cloudflare token "
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center ">
                    <Label htmlFor="accountId">Account ID</Label>
                    <p className="flex items-center text-center text-xs">
                      Don’t have a cloudflare Account yet?
                      <a
                        href="https://dash.cloudflare.com/sign-up"
                        target="_blank"
                        className=" cursor-pointer underline ml-2"
                        rel="noreferrer">
                        Sign up
                      </a>
                    </p>
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
                    {namespaceId?.trim() && accountId?.trim() ? (
                      <a
                        href={`https://dash.cloudflare.com/${accountId.trim()}/workers/kv/namespaces/${namespaceId.trim()}`}
                        target="_blank"
                        className=" cursor-pointer underline ml-2"
                        rel="noreferrer">
                        Go to namespace
                      </a>
                    ) : null}

                    {/* {namespaceId ? null : (
                      <div className="text-center ml-16 text-sm">
                        Don’t have an ID yet?
                        <span className=" cursor-pointer underline ml-2">Create</span>
                      </div>
                    )} */}
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
              </div>
            </CardContent>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">Or continue with</span>
            </div>
            <CardContent>
              <Button disabled={loading} onClick={handleLaunchAuth} className="w-full mt-6" variant="outline" size="sm">
                <img
                  src={chrome.runtime.getURL('popup/github.svg')}
                  className="ml-1 h-4 w-4 overflow-hidden object-contain "
                  alt="logo"
                />
                <span className="ml-2">Using with GitHub</span>
              </Button>
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
