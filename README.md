<div align="center">
<img src="chrome-extension/public/icon-128.png" alt="logo"/>
<h1> Sync your cookie to Your Cloudflare</h1>

![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://badges.aleen42.com/src/vitejs.svg)
![GitHub action badge](https://github.com/jackluson/sync-your-cookie/actions/workflows/build-zip.yml/badge.svg)
<!-- <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://github.com/jackluson/sync-your-cookieFactions&count_bg=%23#222222&title_bg=%23#454545&title=😀&edge_flat=true" alt="hits"/> -->

</div>

[English](./README.md) | [中文](./README_ZH.md)

`Sync your cookie` is a chrome extension that helps you to sync your cookie to Cloudflare. It's a useful tool for web developers to share cookies between different devices. 

### Install
[Sync Your Cookie](https://chromewebstore.google.com/detail/sync-your-cookie/bcegpckmgklcpcapnbigfdadedcneopf)


### Features

- Supports syncing cookies to Cloudflare
- Supports configuring `Auto Merge` and `Auto Push` rules for different sites
- Cookie data is transmitted via protobuf encoding
- Provides a management panel to facilitate viewing, copying, and managing synchronized cookie data


### Project Screenshots

Account Settings Page

<img width="600" src="./screenshots/settings.png" alt="account settings"/>

Cookie Sync Popup Page

<img width="600" src="./screenshots/sync.png" alt="cookie sync popup"/>

Cookie Manager Sidebar Panel

<img width="600" src="./screenshots/panel.png" alt="cookie manager sidebar panel"/>

Cookie Detail

<img width="600" src="./screenshots/panel_item.png" alt="cookie manager sidebar panel"/>



### Usage

[How to use](./how-to-use.md)

### TODO

- [x] Custom Store Configure
- [ ] Multi-account synchronization based on Storage-key
- [ ] Sync LocalStorage
- [ ] More Cloud Platform (First github gist)

### Privacy Policy

Please refer to [Privacy Policy](./private-policy.md) for more information.
