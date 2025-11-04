import {
  useStorageSuspense,
  useTheme,
  verifyCloudflareToken,
  withErrorBoundary,
  withSuspense,
} from '@sync-your-cookie/shared';
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
  SyncTooltip,
  ThemeDropdown,
  Toaster,
} from '@sync-your-cookie/ui';
import { Eye, EyeOff, Info, LogOut, SlidersVertical } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { SettingsPopover } from './components/SettingsPopover';
import { useGithub } from './hooks/useGithub';

const Options = () => {
  const accountInfo = useStorageSuspense(accountStorage);
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

  const handleSave = async () => {
    if (!accountId?.trim() || !token?.trim()) {
      toast.warning('Account ID and Token are required');
      return;
    } else if (!namespaceId?.trim()) {
      toast.warning('NamespaceId are required');
      return;
    }
    try {
      const res = await verifyCloudflareToken(accountId.trim(), token.trim());
      if (res.success === true) {
        const [message] = res.messages;
        if (message?.message) {
          toast.success('Save Success (' + message.message.replace('API', '') + ')');
        } else {
          toast.success('Save Success');
        }
        accountStorage.update({
          selectedProvider: 'cloudflare',
          accountId: accountId,
          namespaceId: namespaceId,
          token: token,
        });
      } else {
        const [error] = res.errors;
        if (error?.message) {
          toast.error('Verify Failed: ' + error.message);
        } else {
          toast.error('Verify Failed: Unknown Error');
        }
      }
    } catch (err: any) {
      console.log('error', err);
      const [error] = err?.errors || [];
      if (error?.message) {
        toast.error('Verify Failed: ' + error.message);
      } else {
        toast.error('Verify Failed: Unknown Error');
      }
    }
  };

  const handleToggleEye = () => {
    setOpenEye(!openEye);
  };

  const handleLogout = () => {
    accountStorage.update({
      githubAccessToken: '',
      selectedProvider: 'cloudflare',
      name: '',
      avatarUrl: '',
      bio: '',
      email: '',
    });
    toast.success('Log out Success');
  };

  const renderAccount = () => {
    if (accountInfo.selectedProvider === 'github' && accountInfo.githubAccessToken) {
      return (
        <CardContent className="w-full">
          <div>
            <div className="flex relative items-center">
              <img className="size-12 rounded-full" src={accountInfo.avatarUrl} alt="" />
              <div className="flex  flex-col flex-1 ml-4">
                <SyncTooltip
                  title={
                    <div>
                      <p>
                        githubAccessToken: <span className="text-orange-500">{accountInfo.githubAccessToken}</span>
                      </p>
                      <p>Your accessToken is only stored on your local device.</p>
                    </div>
                  }>
                  <p className="text-base flex items-center font-medium">
                    <span className="mr-2">{accountInfo.name}</span>
                    <Info className="" size={16} />
                  </p>
                </SyncTooltip>
                <p className="text-xs">{accountInfo.email || accountInfo.bio}</p>
              </div>
            </div>
            <Button onClick={handleLogout} type="submit" variant="outline" className="w-full mt-4">
              <LogOut size={16} className="mr-2" />
              Log out
            </Button>
          </div>
        </CardContent>
      );
    }
    return (
      <>
        <CardContent>
          <CardDescription className="mt-[-16px] mb-4">
            Enter your cloudflare account Or using Github Gist
          </CardDescription>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex justify-between items-center ">
                <Label htmlFor="token">Authorization Token</Label>
                <p className="flex items-center text-center text-xs">
                  <a
                    href="https://github.com/jackluson/sync-your-cookie/blob/main/how-to-use.md"
                    target="_blank"
                    className=" cursor-pointer underline mx-2"
                    rel="noreferrer">
                    How to get it?
                  </a>
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
                </p>
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
      </>
    );
  };

  return (
    <div className="w-screen h-screen absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center p-4 bg-background ">
      <div className="fixed right-8 top-8 ">
        <ThemeDropdown setTheme={setTheme} />
      </div>
      <div className=" mt-[-80px] flex justify-center flex-col items-center">
        <img
          src={chrome.runtime.getURL('options/logo.png')}
          className="size-40 overflow-hidden object-contain mb-4 animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        <div className="w-full">
          <Card className="mx-auto min-w-[400px] max-w-lg">
            <CardHeader className="relative">
              <div className="flex justify-between">
                <CardTitle className="text-xl">Settings</CardTitle>
              </div>
              <SettingsPopover
                trigger={
                  <Button variant="secondary" size="icon" className="size-6 absolute right-4 top-4">
                    <SlidersVertical size={18} />
                  </Button>
                }
              />
            </CardHeader>
            {renderAccount()}
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
