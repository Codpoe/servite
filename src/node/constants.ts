import path from 'upath';

export const APP_DIR = path.resolve(__dirname, '../client/app');

export const DEFAULT_SERVER_ENTRY = [
  'server.js',
  'server.ts',
  'server/index.js',
  'server/index.ts',
];
