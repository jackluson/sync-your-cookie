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

  const handleListGist = async () => {
    try {
      // const res = await githubApi.fetchUser();
      // console.log("this token", githubApi)
      // const res = await githubApi.createGist('example of gist', 'SYNC_COOKIE.md', 'xxxxx', true);
      // const res = await githubApi.listGists();
      // const res = await githubApi.getGist('c8cbb4fe554311ffd1fca61a5284d141');
      // const res = await githubApi.updateGist(
      //   'c8cbb4fe554311ffd1fca61a5284d141',
      //   'updated gist',
      //   'SYNC_COOKIE.md',
      //   'yyyyyy',
      // );
      const res = await GithubApi.instance.deleteGist('c8cbb4fe554311ffd1fca61a5284d141');
      console.log('res >', res);
    } catch (error) {
      console.log('error', error);
    }
    // githubApi.listGists().then(gists => {
    //   console.log('fetch gist list', gists);
    // });
  };
  return {
    handleLaunchAuth,
    handleListGist,
    loading,
  };
};
