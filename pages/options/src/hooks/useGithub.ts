import { clientId, GithubApi, initGithubApi, scope } from '@sync-your-cookie/shared';
import { accountStorage } from '@sync-your-cookie/storage/lib/accountStorage';
import { useState } from 'react';
import { toast } from 'sonner';

initGithubApi();

export const useGithub = () => {
  const [loading, setLoading] = useState(false);
  const handleLaunchAuth = async () => {
    const state = crypto.randomUUID();
    const redirectUri = chrome.identity.getRedirectURL();
    const authUrl =
      `https://github.com/login/oauth/authorize?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${state}`;
    setLoading(true);
    try {
      chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true }, async redirectUrl => {
        console.log('redirectUrl', redirectUrl);
        const code = redirectUrl ? new URL(redirectUrl).searchParams.get('code') : '';
        if (code) {
          try {
            console.log('code', code);
            const accessToken = await GithubApi.instance.fetchAccessToken(code);
            console.log('accessToken', accessToken);
            setLoading(false);
            const user = await GithubApi.instance.fetchUser();
            accountStorage.update({
              githubAccessToken: accessToken,
              selectedProvider: 'github',
              name: user.name,
              avatarUrl: user.avatar_url,
              bio: user.bio,
              email: user.email,
            });
            GithubApi.instance.reload();
            console.log('user', user);
            toast.success('GitHub Authorization Success');
          } catch (error) {
            toast.error('GitHub Authorization Failed');
            setLoading(false);
          }
        } else {
          setLoading(false);
          toast.error('GitHub Authorization Failed');
        }
      });
    } catch (error) {
      console.error('Auth error', error);
      toast.error('GitHub Authorization Failed');
      setLoading(false);
    }
  };

  return {
    handleLaunchAuth,
    loading,
  };
};
