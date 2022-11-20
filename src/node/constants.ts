export const PAGES_MODULE_ID = 'virtual:servite/pages';
export const RESOLVED_PAGES_MODULE_ID = '\0' + PAGES_MODULE_ID;

export const PAGES_ROUTES_MODULE_ID = 'virtual:servite/pages-routes';
export const RESOLVED_PAGES_ROUTES_MODULE_ID = '\0' + PAGES_ROUTES_MODULE_ID;

export const CUSTOM_SERVER_RENDER_MODULE_ID =
  'virtual:servite/custom-server-render';
export const RESOLVED_CUSTOM_SERVER_RENDER_MODULE_ID =
  '\0' + CUSTOM_SERVER_RENDER_MODULE_ID;

export const SCRIPT_EXTS = ['.js', '.jsx', '.ts', '.tsx'];

export const PAGES_PATTERN = [
  '**/{page,layout}.{js,jsx,ts,tsx}',
  '**/*.{md,mdx}',
];
export const PAGES_IGNORE_PATTERN = [
  '**/{test,tests,__tests__}/**',
  '**/*.test.*',
];

export const MARKDOWN_EXTS = ['.md', '.mdx'];

export const ISLAND_SPLITTER = '__ISLAND__';

// eg. virtual:servite/islands/JYWwDg9gTgLgBAbzgEwKYDMCGBXANvTAZzgEE4BfOdKCEOAcgDoB6E+gbgCgBjCAO0LxghXJj7IA+gAY4AXjgAKAJRyAfKS6dQkWIjgAhClRp0mzfRx79BcYaPESAjHMUrZ6-YwDCm3gKEiYpIATC7Karbg0DAKZgAi9EqMMAAWqHwKIBDIEVnIjGhYeDBKmgDuwOIQZYwSEgCSAMoAMiQAcnGNdS4A2pxwtoEOUgA0-YP2ko5jA3ZBEsGcALrsQA
export const ISLANDS_MODULE_ID_PREFIX = 'virtual:servite/islands/';
