import { Octokit } from '@octokit/rest';
import { accountStorage } from '@sync-your-cookie/storage/lib/accountStorage';

export class GithubApi {
  private clientId: string;
  private clientSecret: string;
  private accessToken?: string | null = null;

  octokit!: Octokit;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.accessToken = accountStorage.getSnapshot()?.githubAccessToken;
    this.newOctokit();
    this.subscribe();
  }

  newOctokit() {
    if (this.accessToken) {
      this.octokit = new Octokit({ auth: this.accessToken });
      this.octokit.hook.before('request', options => {
        console.log('请求 URL:', options.url);
        console.log('请求头:', options.headers);
      });
    }
  }

  subscribe() {
    accountStorage.subscribe(async () => {
      this.accessToken = accountStorage.getSnapshot()?.githubAccessToken;
      console.log('subscribe->accessToken', this.accessToken);
      this.newOctokit();
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
  async fetchUser(): Promise<any> {
    this.ensureToken();
    const res = await fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${this.accessToken}` },
    });
    return res.json();
  }

  async request(method: string, path: string, payload: Record<string, any> = {}) {
    console.log('payload', payload, this.accessToken);
    this.ensureToken();
    const res = await this.octokit.request(`${method} ${path}`, {
      ...payload,
      headers: {
        // Authorization: `Bearer ${this.accessToken as string}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    console.log('octokit->res', res);
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

  // 获取 gist 列表
  async listGists(): Promise<any> {
    const res = await this.octokit.gists.list();
    return res;
  }

  // 创建 gist
  async createGist(description: string, filename: string, content: string, publicGist = false): Promise<any> {
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

  // 更新 gist
  async updateGist(gistId: string, files: any, description?: string): Promise<any> {
    this.ensureToken();
    const body: any = { files };
    if (description) body.description = description;
    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `token ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  // 删除 gist
  async deleteGist(gistId: string): Promise<void> {
    this.ensureToken();
    await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'DELETE',
      headers: { Authorization: `token ${this.accessToken}` },
    });
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
}

export const scope = 'gist';
export const clientId = 'Ov23liyhOkJsj8FzPlm0';
const clientSecret = (process as any).env.CLIENT_SECRET;

export const githubApi = new GithubApi(clientId, clientSecret);
