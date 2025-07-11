import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

const isFirefox = process.env.__FIREFOX__ === 'true';

const sidePanelConfig = {
  side_panel: {
    default_path: 'sidepanel/index.html',
  },
  permissions: !isFirefox ? ['sidePanel', 'contextMenus'] : [],
};

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = Object.assign(
  {
    manifest_version: 3,
    default_locale: 'en',
    /**
     * if you want to support multiple languages, you can use the following reference
     * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
     */
    name: 'Sync Your Cookie',
    version: packageJson.version,
    description: 'A browser extension that syncs and manages your cookies to your cloudflare',
    permissions: ['cookies', 'tabs', 'storage'].concat(sidePanelConfig.permissions),
    host_permissions: ['<all_urls>'],
    options_page: 'options/index.html',
    background: {
      service_worker: 'background.iife.js',
      type: 'module',
    },
    action: {
      default_popup: 'popup/index.html',
      default_icon: 'icon-34.png',
    },
    // chrome_url_overrides: {
    //   newtab: 'newtab/index.html',
    // },
    icons: {
      128: 'icon-128.png',
    },
    // devtools_page: 'devtools/index.html',
    content_scripts: [
      {
        matches: ['<all_urls>'],
        js: ['content-scripts/localStorage.js'],
        run_at: 'document_start',
      },
    ],
    web_accessible_resources: [
      {
        resources: ['*.js', '*.css', '*.svg', 'icon-128.png', 'icon-34.png'],
        matches: ['*://*/*'],
      },
    ],
  },
  !isFirefox && { side_panel: { ...sidePanelConfig.side_panel } },
);

export default manifest;
