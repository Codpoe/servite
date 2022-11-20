import { fileURLToPath } from 'url';
import path from 'upath';

export const PKG_DIR = path.resolve(fileURLToPath(import.meta.url), '../../..');
export const DIST_DIR = path.resolve(PKG_DIR, 'dist');
export const SERVER_DIR = path.resolve(DIST_DIR, 'server');
export const CLIENT_DIR = path.resolve(DIST_DIR, 'client');
export const APP_DIR = path.resolve(CLIENT_DIR, 'app');
export const APP_HTML_FILE = path.resolve(APP_DIR, 'index.html');
export const CLIENT_ENTRY_FILE = path.resolve(APP_DIR, 'entry.client.js');
export const FS_PREFIX_CLIENT_ENTRY = `/@fs/${CLIENT_ENTRY_FILE}`;
export const SSR_ENTRY_FILE = path.resolve(APP_DIR, 'entry.server.js');
