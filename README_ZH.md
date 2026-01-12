<div align="center">
<img src="chrome-extension/public/icon-128.png" alt="logo"/>
<h1> Sync your cookie to Cloudflare or Github Gist</h1>
</div>

[English](./README.md) | [中文](./README_ZH.md)

`Sync your cookie` 是一个 Chrome 扩展程序，它可以帮助您将 Cookie 同步到 Cloudflare。它是一个有用的工具，用于在不同设备之间共享 Cookie, 免去了登录流程的烦恼，此外也提供了cookie管理面板查看，管理已经过同步的 cookie。


### 安装
Chrome: [Sync Your Cookie](https://chromewebstore.google.com/detail/sync-your-cookie/bcegpckmgklcpcapnbigfdadedcneopf)

Edge: [Sync Your Cookie](https://microsoftedge.microsoft.com/addons/detail/sync-your-cookie/ohlcghldllgnmkegocpcphdbbphikgfm)


### 功能
- 支持同步 Cookie 到 Cloudflare 或者 github Gist (支持LocalStorage)
- 支持为不同站点配置`Auto Merge`和`Auto Push`规则
- Cookie数据经过 protobuf 编码传输
- 提供了一个管理面板，方便查看、复制、管理已经同步的 Cookie 数据
- 可配置多个Key，支持多账户同步

### 项目截图

账号设置页面

<img width="600" src="./screenshots/settings_v2.png" alt="account settings"/>

Cookie 同步页面

<img width="600" src="./screenshots/sync.png" alt="cookie sync popup"/>

Cookie 管理侧边栏面板

<img width="600" src="./screenshots/panel.png" alt="cookie manager sidebar panel"/>

Cookie 详情

<img width="600" src="./screenshots/panel_item.png" alt="cookie manager sidebar panel"/>


Github Gist上传的cookie

<img width="600" src="./screenshots/gist.png" alt="Pushed Cookie on Github Gist"/>


Cloudflare上传的cookie

<img width="600" src="./screenshots/key_value.png" alt="Pushed Cookie on Cloudflare"/>



### 使用指引

[How to use](./how-to-use.md)

### Privacy Policy

Please refer to [Privacy Policy](./private-policy.md) for more information.




