import fs from 'node:fs';
import { resolve } from 'node:path';
import { zipBundle } from './lib/index.js';
const IS_FIREFOX = process.env.BROWSER === 'firefox';
const packageJson = JSON.parse(fs.readFileSync('../../package.json', 'utf8'));

const YYYY_MM_DD = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const HH_mm_ss = new Date().toISOString().slice(11, 19).replace(/:/g, '');

const fileName = `extension-${packageJson.version}-${YYYY_MM_DD}-${HH_mm_ss}`;

await zipBundle({
  distDirectory: resolve(import.meta.dirname, '..', '..', '..', 'dist'),
  buildDirectory: resolve(import.meta.dirname, '..', '..', '..', 'dist-zip'),
  archiveName: IS_FIREFOX ? `${fileName}.xpi` : `${fileName}.zip`,
}).catch(error => {
  console.error('Error zipping the bundle:', error);
  process.exit(1);
});

console.log('Zipping completed');
