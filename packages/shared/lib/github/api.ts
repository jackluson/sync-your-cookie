import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import { arrayBufferToBase64, encodeCookiesMap, ICookiesMap } from '@sync-your-cookie/protobuf';
import { accountStorage } from '@sync-your-cookie/storage/lib/accountStorage';
import { IStorageItem, settingsStorage } from '@sync-your-cookie/storage/lib/settingsStorage';

export class GithubApi {
  private clientId: string;
  private clientSecret: string;
  private accessToken?: string | null = null;

  private prefix = 'sync-your-cookie_';

  static instance: GithubApi;

  octokit!: Octokit;

  private inited = false;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.accessToken = accountStorage.getSnapshot()?.githubAccessToken;
    this.subscribe();
    this.init();
  }

  public static getInstance(clientId: string, clientSecret: string): GithubApi {
    if (!GithubApi.instance) {
      GithubApi.instance = new GithubApi(clientId, clientSecret);
    }
    return GithubApi.instance;
  }

  async newOctokit() {
    if (this.accessToken) {
      this.octokit = new Octokit({ auth: this.accessToken });
      this.octokit.hook.before('request', options => {
        console.log('请求 URL:', options.url);
        console.log('请求头:', options.headers);
      });
    }
  }

  async init() {
    if (this.inited) {
      return;
    }
    this.newOctokit();
    this.initStorageKeyList();
    this.inited = true;
  }

  async getSyncGists() {
    const res = await this.listGists();
    const fullList = res.data;
    const syncGist = fullList.find(gist => {
      const files = gist.files;
      const keys = Object.keys(files);
      const hasSyncFile = keys.some(key => key.startsWith(this.prefix));
      return hasSyncFile;
    });
    return syncGist;
  }

  async initStorageKeyList() {
    if (!this.octokit) {
      return;
    }
    let syncGist = await this.getSyncGists();

    if (!syncGist) {
      console.log('No sync gists found, creating one...');
      const content = await this.initContent();
      const newGist = await this.createGist('Sync Your Cookie Gist', `${this.prefix}Default`, content, false);
      // syncGists.push(newGist.data);
      console.log('newGist', newGist);
      syncGist = await this.getSyncGists();
    }
    console.log('syncGists', syncGist);
    if (syncGist) {
      await this.setStorageKeyList(syncGist);
    }
  }

  async initContent() {
    const cookiesMap: ICookiesMap = {
      updateTime: Date.now(),
      createTime: Date.now(),
      domainCookieMap: {},
    };
    let encodingStr = '';
    const protobufEncoding = settingsStorage.getSnapshot()?.protobufEncoding;
    if (protobufEncoding) {
      const buffered = await encodeCookiesMap(cookiesMap);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      encodingStr = arrayBufferToBase64(buffered as any);
    } else {
      encodingStr = JSON.stringify(cookiesMap);
    }
    return encodingStr;
  }

  async setStorageKeyList(gist: RestEndpointMethodTypes['gists']['list']['response']['data'][number]) {
    const files = gist.files;
    const storageKeys: IStorageItem[] = [];
    if (files) {
      const currentStorageKey = settingsStorage.getSnapshot()?.storageKey;
      let currentStorageExist = false;
      for (const filename in files) {
        const file = files[filename];
        if (filename.startsWith(this.prefix)) {
          const tempValue = filename.replace(this.prefix, '');
          if (!currentStorageExist) {
            if (currentStorageKey && tempValue === currentStorageKey) {
              currentStorageExist = true;
            }
          }
          storageKeys.push({
            value: tempValue,
            label: tempValue,
            rawUrl: file.raw_url,
            gistId: gist.id,
          });
          // storageKeys.push(file[0].replace(this.prefix, ''));
        }
      }
      console.log('storageKeys', storageKeys, gist.id);
      settingsStorage.update({
        storageKeyList: storageKeys,
        storageKey: currentStorageExist ? currentStorageKey : storageKeys[0]?.value,
        storageKeyGistId: gist.id,
        gistHtmlUrl: gist.html_url,
      });
    } else {
      console.log('No files found in gist', gist.id);
    }
    // const keys = Object.keys(files);
    // const storageKeys = keys.filter(key => key.startsWith(this.prefix)).map(key => key.replace(this.prefix, ''));
    // console.log('storageKeys', storageKeys);
    // return storageKeys;
  }

  subscribe() {
    accountStorage.subscribe(async () => {
      const accessToken = accountStorage.getSnapshot()?.githubAccessToken;
      if (this.accessToken === accessToken || !accessToken) {
        return;
      }
      this.accessToken = accessToken;
      console.log('GithubApi accountStorage changed -> this.accessToken', this.accessToken);
      this.inited = false;
      this.init();
    });
  }

  // 用 code 换取 access_token
  async fetchAccessToken(code: string): Promise<string> {
    const url = 'https://github.com/login/oauth/access_token';
    const params = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
    };
    const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (data.access_token) {
      this.accessToken = data.access_token;
      return this.accessToken || '';
    }
    throw new Error('获取 access_token 失败');
  }

  // 用 access_token 获取用户信息
  async fetchUser() {
    this.ensureToken();
    // const res = await this.octokit.users.getById();

    const res = await fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${this.accessToken}` },
    });
    return res.json() as Promise<RestEndpointMethodTypes['users']['getById']['response']['data']>;
  }

  async request(method: string, path: string, payload: Record<string, any> = {}) {
    this.ensureToken();
    const res = await this.octokit.request(`${method} ${path}`, {
      ...payload,
      headers: {
        // Authorization: `Bearer ${this.accessToken as string}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (res.status !== 200) {
      return Promise.reject(res);
    }
    return res.data;
  }

  async get(path: string) {
    return this.request('GET', path);
  }

  async post(path: string, payload: Record<string, any> = {}) {
    return this.request('POST', path, payload);
  }

  async patch(path: string, payload: Record<string, any> = {}) {
    return this.request('PATCH', path, payload);
  }

  // 获取 gist 列表
  async listGists() {
    const res = await this.octokit.gists.list();
    return res;
  }

  // 创建 gist
  async createGist(description: string, filename: string, content: string, publicGist = false) {
    return this.octokit.gists.create({
      description: description,
      public: publicGist,
      files: {
        [filename]: {
          content: content,
        },
      },
    });
  }

  async getGist(gistId: string) {
    return this.octokit.gists.get({ gist_id: gistId });
  }

  // 更新 gist
  async updateGist(gistId: string, filename: string, content: string) {
    // const { data: gist } = await this.octokit.gists.get({
    //   gist_id: gistId,
    // });
    // console.log('files', gist.files);
    // const existFiles = gist.files || {};
    const syncFileName = filename.startsWith(this.prefix) ? filename : this.prefix + filename;
    const res = await this.octokit.gists.update({
      gist_id: gistId,
      files: {
        [syncFileName]: {
          content: content,
        },
      },
    });
    // update settingsStorage based result
    this.setStorageKeyList(res.data as unknown as RestEndpointMethodTypes['gists']['list']['response']['data'][number]);
    return res;
    // return this.patch(`/gists/${gistId}`, {
    //   files: {
    //     [filename]: {
    //       content: content,
    //     },
    //   },
    // });
  }

  async addGistFile(gistId: string, filename: string) {
    return this.updateGist(gistId, filename, await this.initContent());
  }

  async deleteGistFile(gistId: string, filename: string) {
    const syncFileName = filename.startsWith(this.prefix) ? filename : this.prefix + filename;
    return this.octokit.gists.update({
      gist_id: gistId,
      files: {
        [syncFileName]: null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });
  }

  // 删除 gist
  async deleteGist(gistId: string) {
    return this.octokit.gists.delete({ gist_id: gistId });
  }

  private ensureToken() {
    if (!this.accessToken) {
      this.accessToken = accountStorage.getSnapshot()?.githubAccessToken;
      console.log('this.accessToken', this.accessToken);
      this.newOctokit();
    }
    if (!this.accessToken) {
      throw new Error('请先获取 access_token');
    }
  }

  async fetchRawContent(rawUrl: string) {
    const content = await fetch(rawUrl).then(res => res.text());
    return content;
  }
}

export const scope = 'gist';
export const clientId = 'Ov23liyhOkJsj8FzPlm0';
const clientSecret = '';

// export const githubApi = new GithubApi(clientId, clientSecret);

export const initGithubApi = async () => {
  console.log('initGithubApi finish');
  GithubApi.getInstance(clientId, clientSecret);
};
