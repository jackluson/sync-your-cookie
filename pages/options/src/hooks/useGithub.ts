import { GithubApi } from '@sync-your-cookie/shared';
import { accountStorage } from '@sync-your-cookie/storage/lib/accountStorage';
import { useState } from 'react';
import { toast } from 'sonner';
const scope = 'gist';
const clientId = 'Ov23liyhOkJsj8FzPlm0';
const clientSecret = (process as any).env.CLIENT_SECRET;
const githubApi = new GithubApi(clientId, clientSecret);

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
            const accessToken = await githubApi.fetchAccessToken(code);
            console.log('accessToken', accessToken);
            setLoading(false);
            const user = await githubApi.fetchUser();
            accountStorage.update({
              githubAccessToken: accessToken,
              selectedProvider: 'github',
              name: user.name,
              avatarUrl: user.avatar_url,
              bio: user.bio,
              email: user.email,
            });
            console.log('user', user);
            toast.success('GitHub Authorization Success');
            // if (code) {
            //   // Exchange code for token via your backend
            //   fetch('https://your-backend.com/auth/github', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ code })
            //   })
            //   .then(response => response.json())
            //   .then(data => {
            //     chrome.storage.local.set({ github_token: data.access_token });
            //     sendResponse({ success: true });
            //   });
            // }
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

  const handleListGist = () => {
    githubApi.listGists().then(gists => {
      console.log('gists', gists);
    });
  };
  return {
    handleLaunchAuth,
    handleListGist,
    loading,
  };
};
