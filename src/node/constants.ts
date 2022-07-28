import { fileURLToPath } from 'url';
import path from 'upath';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DIST_DIR = path.resolve(__dirname, '..');
export const APP_DIR = path.resolve(DIST_DIR, 'client/app');
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
