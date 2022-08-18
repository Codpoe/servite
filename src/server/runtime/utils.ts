import { extname } from 'path';

export function lazyCachedFn<T>(fn: () => Promise<T>): () => Promise<T> {
  let res: Promise<T> | null = null;
  return () => {
    if (res === null) {
      res = fn().catch(err => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}

/**
 * Disable console.log
 */
export function trapConsole() {
  const consoleLog = global.console.log;
  global.console.log = (() => {
    // ...
  }) as any;

  return () => {
    global.console.log = consoleLog;
  };
}

export function renderPreloadLink(link: string): string {
  switch (extname(link)) {
    case '.js':
      return `<link rel="modulepreload" crossorigin href="${link}">`;
    case '.css':
      return `<link rel="stylesheet" href="${link}">`;
    case '.jpg':
    case '.jpeg':
      return ` <link rel="preload" href="${link}" as="image" type="image/jpeg">`;
    case '.png':
      return ` <link rel="preload" href="${link}" as="image" type="image/png">`;
    case '.gif':
      return ` <link rel="preload" href="${link}" as="image" type="image/gif">`;
    case '.woff':
      return ` <link rel="preload" href="${link}" as="font" type="font/woff" crossorigin>`;
    case '.woff2':
      return ` <link rel="preload" href="${link}" as="font" type="font/woff2" crossorigin>`;
    default:
      return '';
  }
}
