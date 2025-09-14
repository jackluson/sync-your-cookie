export class GithubApi {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
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
    console.log('res', res);
    return res.json();
  }

  // 获取 gist 列表
  async listGists(): Promise<any> {
    this.ensureToken();
    const res = await fetch('https://api.github.com/gists', {
      headers: { Authorization: `token ${this.accessToken}` },
    });
    return res.json();
  }

  // 创建 gist
  async createGist(description: string, files: any, publicGist = false): Promise<any> {
    this.ensureToken();
    const res = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        Authorization: `token ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description, files, public: publicGist }),
    });
    return res.json();
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
    if (!this.accessToken) throw new Error('请先获取 access_token');
  }
}
