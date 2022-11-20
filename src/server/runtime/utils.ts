import { extname } from 'path';
import { Island } from '../../shared/types.js';

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

export function renderScript({
  type,
  src,
  children = '',
}: {
  type?: 'module';
  src?: string;
  children?: string;
}) {
  if (!src && !children) {
    return '';
  }
  return `<script${type ? ` type=${type}` : ''}${
    src ? ` crossorigin src="${src}"` : ''
  }>${children}</script>`;
}

export function renderTag(
  tagName: string,
  attrs: Record<string, any>,
  children?: string
) {
  return `<${tagName}${Object.entries(attrs).map(([k, v]) =>
    v == null ? '' : ` ${k}="${v}"`
  )}>${children || ''}</${tagName}>`;
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

/**
 * Generate islands code.
 * @example
 * import { createElement } from 'react';
 * import { createRoot, hydrateRoot } from 'react-dom/client';
 *
 * window.__SERVITE__createElement = createElement;
 * window.__SERVITE__createRoot = createRoot;
 * window.__SERVITE__hydrateRoot = hydrateRoot;
 *
 * import { default as A } from './A';
 * const island_0 = () => A;
 *
 * import { B } from './B';
 * const island_1 = () => B.C;
 *
 * const island_2 = () => import('./D').then(mod => mod.default);
 *
 * window.__SERVITE__islands = [
 *   island_0,
 *   island_1,
 *   island_2
 * ];
 *
 * window.dispatchEvent(new CustomEvent('servite:hydrate'));
 */
export function renderIslandsCode(islands: Island[]) {
  let index = 0;

  let code = `import { createElement } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

window.__SERVITE__createElement = createElement;
window.__SERVITE__createRoot = createRoot;
window.__SERVITE__hydrateRoot = hydrateRoot;

${islands
  .map(({ type, component }) => {
    const [, imported, componentPath] =
      component.match(/(.*?)__ISLAND__(.*)/) || [];
    const [, first, members] = imported.match(/([^.]*)(.*)/) || [];

    const islandName = `island_${index++}`;

    if (type === 'load') {
      const importName = `__import_${islandName}`;

      return `import { ${first} as ${importName} } from '${componentPath}';
const ${islandName} = () => ${importName}${members}\n`;
    }

    return `const ${islandName} = () => import('${componentPath}').then(mod => mod.${imported});\n`;
  })
  .join('\n')}`;

  code += `
window.__SERVITE__islands = [
  ${islands.map((_, index) => `island_${index}`).join(',\n  ')}
];

// Notify hydrator
window.dispatchEvent(new CustomEvent('servite:hydrate'));
`;

  return code;
}
