import { fileURLToPath } from 'url';
import path from 'upath';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DIST_DIR = path.resolve(__dirname, '..');
export const APP_DIR = path.resolve(DIST_DIR, 'client/app');
export const APP_HTML_FILE = path.resolve(APP_DIR, 'index.html');
export const FS_PREFIX_APP_HTML = `/@fs/${APP_HTML_FILE}`;
export const CLIENT_ENTRY_FILE = path.resolve(APP_DIR, 'entry.client.js');
export const FS_PREFIX_CLIENT_ENTRY = `/@fs/${CLIENT_ENTRY_FILE}`;
export const SSR_ENTRY_FILE = path.resolve(APP_DIR, 'entry.server.js');

export const DEFAULT_SERVER_ENTRY = [
  'server.js',
  'server.ts',
  'server/index.js',
  'server/index.ts',
];

export const PAGES_MODULE_ID = 'virtual:servite/pages';
export const RESOLVED_PAGES_MODULE_ID = '\0' + PAGES_MODULE_ID;

export const ROUTES_MODULE_ID = 'virtual:servite/routes';
export const RESOLVED_ROUTES_MODULE_ID = '\0' + ROUTES_MODULE_ID;

export const PAGE_PATTERN = [
  '**/{page,layout}.{js,jsx,ts,tsx}',
  '**/*.{md,mdx}',
];
export const IGNORE_PATTERN = ['**/{tests,__tests__}/**'];
