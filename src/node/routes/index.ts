import path from 'upath';
import fs from 'fs-extra';
import {
  ModuleNode,
  Plugin,
  ResolvedConfig,
  transformWithEsbuild,
  ViteDevServer,
} from 'vite';
import fg from 'fast-glob';
import mm from 'micromatch';
import matter from 'gray-matter';
import {
  IGNORE_PATTERN,
  PAGES_MODULE_ID,
  PAGE_PATTERN,
  RESOLVED_PAGES_MODULE_ID,
  RESOLVED_ROUTES_MODULE_ID,
  ROUTES_MODULE_ID,
} from '../constants.js';
import { isMarkdown } from '../utils.js';
import { Page, Route, ServiteConfig } from '../types.js';
import { generateEnhanceCode } from './enhance.js';

interface RoutesConfig extends Partial<Pick<ServiteConfig, 'pagesDir'>> {}

export function routes({ pagesDir = 'src/pages' }: RoutesConfig = {}): Plugin {
  let viteConfig: ResolvedConfig;
  let viteDevServer: ViteDevServer;
  let pagesPromise: Promise<Page[]> = Promise.resolve([]);

  async function startFindPages() {
    return (pagesPromise = findPages(viteConfig.root, pagesDir));
  }

  async function stopFindPages() {
    pagesPromise = Promise.resolve([]);
  }

  async function getPages() {
    return pagesPromise;
  }

  async function checkPageFile(filePath: string) {
    filePath = path.relative(viteConfig.root, filePath);

    const isPageFile =
      filePath.startsWith(path.join(pagesDir, '/')) &&
      mm.isMatch(filePath, PAGE_PATTERN, {
        cwd: path.resolve(viteConfig.root, pagesDir),
        ignore: IGNORE_PATTERN,
      });

    const isExisting =
      isPageFile && (await getPages()).some(p => p.filePath === filePath);

    return {
      isPageFile,
      isExisting,
    };
  }

  function getRoutesAndPagesModules() {
    return [
      ...(viteDevServer.moduleGraph.getModulesByFile(
        RESOLVED_ROUTES_MODULE_ID
      ) || []),
      ...(viteDevServer.moduleGraph.getModulesByFile(
        RESOLVED_PAGES_MODULE_ID
      ) || []),
    ];
  }

  return {
    name: 'servite:routes',
    // TODO: optimize deps for routes
    configResolved(config) {
      viteConfig = config;
    },
    configureServer(server) {
      viteDevServer = server;

      server.watcher.on('unlink', async filePath => {
        const { isPageFile, isExisting } = await checkPageFile(filePath);

        if (isPageFile && isExisting) {
          const seen = new Set<ModuleNode>();
          getRoutesAndPagesModules().forEach(mod => {
            viteDevServer.moduleGraph.invalidateModule(mod, seen);
          });
          startFindPages();
        }
      });
    },
    async buildStart() {
      startFindPages();
    },
    closeBundle() {
      stopFindPages();
    },
    resolveId(source) {
      if (source === PAGES_MODULE_ID) {
        return RESOLVED_PAGES_MODULE_ID;
      }
      if (source === ROUTES_MODULE_ID) {
        return RESOLVED_ROUTES_MODULE_ID;
      }
    },
    async load(id, opts) {
      if (id === RESOLVED_PAGES_MODULE_ID) {
        const pages = await getPages();

        return `export const pages = ${JSON.stringify(
          sortPages(pages),
          null,
          2
        )};
export default pages;
`;
      }

      if (id === RESOLVED_ROUTES_MODULE_ID) {
        const pages = await getPages();

        return transformWithEsbuild(
          generateRoutesCode(viteConfig, pages, opts?.ssr),
          RESOLVED_ROUTES_MODULE_ID,
          { loader: 'jsx' }
        );
      }
    },
    async transform(code, id) {
      // export will affect @vitejs/plugin-react's judgment of react refresh boundary,
      // so we need to handle hmr for specific export.
      // https://github.com/vitejs/vite/blob/9baa70b788ec0b0fc419db30d627567242c6af7d/packages/plugin-react/src/fast-refresh.ts#L87
      if ((await checkPageFile(id)).isPageFile) {
        return addHmrAccept(code, 'loader');
      }
    },
    async handleHotUpdate(ctx) {
      const modules = [...ctx.modules];
      const { isPageFile, isExisting } = await checkPageFile(ctx.file);

      if (isPageFile && !isExisting) {
        modules.push(...getRoutesAndPagesModules());
        startFindPages();
      }

      return modules;
    },
  };
}

async function findPages(root: string, pagesDir: string): Promise<Page[]> {
  const pageFiles = await fg(
    ['**/{page,layout}.{js,jsx,ts,tsx}', '**/*.{md,mdx}'],
    {
      cwd: path.resolve(root, pagesDir),
      ignore: ['**/{tests,__tests__}/**'],
    }
  );

  return Promise.all(
    pageFiles.map(pageFile => createPage(root, pagesDir, pageFile))
  );
}

function createPage(root: string, pagesDir: string, pageFile: string): Page {
  const basename = path.basename(path.trimExt(pageFile));
  const routePath = resolveRoutePath(pageFile);
  const filePath = path.join(pagesDir, pageFile);
  const fileContent = fs.readFileSync(path.resolve(root, filePath), 'utf-8');
  const meta = isMarkdown(pageFile) ? extractFrontMatter(fileContent) : {};

  return {
    routePath,
    filePath,
    isLayout: basename === 'layout',
    is404: basename === '404',
    meta,
  };
}

function resolveRoutePath(pageFile: string) {
  let routePath = path
    .trimExt(path.join('/', pageFile))
    .replace(/\/404$/, '/*') // transform '/404' to '/*' so this route acts like a catch-all for URLs that we don't have explicit routes for
    .replace(/\/\[\.{3}.*?\]$/, '/*') // transform '/post/[...all]' to '/post/*'
    .replace(/\/\[(.*?)\]/g, '/:$1'); // transform 'user/[id]' to 'user/:id'

  if (isMarkdown(pageFile)) {
    routePath = routePath
      .replace(/^(\/index){1,2}$/, '') // remove '/index'
      .replace(/\/README$/i, ''); // remove '/README'
  } else {
    routePath = routePath.replace(/\/(page|layout)$/, ''); // remove '/page' and '/layout'
  }

  return routePath;
}

function resolvePageExports(fileContent: string): string[] {
  const exportConst = fileContent.matchAll(/^\s*export\s+const\s+(.*?)=/gm);

  const exportFunction = fileContent.matchAll(
    /^\s*export\s+(?:async\s+)?function\s+(.*?)\s*\(/gm
  );

  return [...exportConst, ...exportFunction].map(x => x[1]);
}

function resolvePageMeta(
  fileContent: string,
  isMarkdown: boolean
): Record<string, any> {
  // parse front matter for markdown
  if (isMarkdown) {
    return extractFrontMatter(fileContent);
  }
  // parse export meta
  return extractMetaExport(fileContent);
}

/**
 * Extract the meta export
 * @example
 * export const meta = { title: 'abc' };
 * -> { title: 'abc' }
 */
function extractMetaExport(fileContent: string): Record<string, any> {
  const matchArr = fileContent.match(/^\s*export\s+const\s+meta\s+=\s+\{/m);

  if (matchArr?.index == null) {
    return {};
  }

  const re = /\{|\}/g;
  const metaExport = fileContent.slice(matchArr.index);
  let execArr: RegExpExecArray | null = null;
  let metaStart: number | null = null;
  let metaEnd: number | null = null;
  let braceFlag = 0;

  while ((execArr = re.exec(metaExport)) != null) {
    if (execArr[0] === '{') {
      braceFlag++;
    } else {
      braceFlag--;
    }

    if (braceFlag === 1 && !metaStart) {
      metaStart = matchArr.index + execArr.index;
    }

    if (braceFlag === 0) {
      metaEnd = matchArr.index + execArr.index + 1;
      break;
    }
  }

  if (!metaStart || !metaEnd) {
    return {};
  }

  try {
    const meta = JSON.parse(
      fileContent
        .substring(metaStart, metaEnd)
        // remove trailing comma
        .replace(/,\s*(]|})/g, '$1')
        // ' -> "
        .replace(/'/g, `"`)
        // put double quotes on the object's key
        .replace(/[{|\s](\w*?):/g, (m, p1: string) => m.replace(p1, `"${p1}"`))
    );
    return meta;
  } catch (err) {
    throw new Error(
      'Extract meta fail. Please check that the exported meta data is correct.'
    );
  }
}

function extractFrontMatter(fileContent: string) {
  const { data: frontMatter, content } = matter(fileContent);

  if (!frontMatter.title) {
    const m = content.match(/^#\s+(.*)$/m);
    frontMatter.title = m?.[1];
  }

  return frontMatter;
}

function addHmrAccept(code: string, field: string) {
  if (
    !code.includes('import.meta.hot.accept()') &&
    (new RegExp(`export\\s+const\\s+${field}(\\s|=|:)`).test(code) ||
      new RegExp(`export\\s+(async\\s+)?function\\s+${field}(\\s|\\()`).test(
        code
      ))
  ) {
    return `${code}\n
if (import.meta.hot) {
  const prevField = import.meta.hot.data.${field} = import.meta.hot.data.${field} || ${field};

  import.meta.hot.accept(mod => {
    if (mod) {
      const field = mod.${field};
      if (field?.toString() !== prevField?.toString() || JSON.stringify(field) !== JSON.stringify(prevField)) {
        import.meta.hot.invalidate();
      }
    }
  });
}
`;
  }

  return code;
}

function sortPages(pages: Page[]): Page[] {
  return pages.slice().sort((a, b) => {
    const compareRes = a.routePath.localeCompare(b.routePath);
    // layout first
    return compareRes === 0 && a.isLayout ? -1 : compareRes;
  });
}

function createRoutes(pages: Page[]): Route[] {
  const sortedPages = sortPages(pages);

  const routes: Route[] = [];
  const layoutRouteStack: Route[] = [];

  for (const page of sortedPages) {
    const route: Route = {
      path: page.routePath,
      component: path.join('/', page.filePath),
      children: page.isLayout ? [] : undefined,
      meta: page.meta,
    };

    while (layoutRouteStack.length) {
      const layout = layoutRouteStack[layoutRouteStack.length - 1];

      // - root layout
      // - same level layout
      // - sub level layout
      if (
        layout.path === '/' ||
        layout.path === route.path ||
        route.path.startsWith(layout.path + '/')
      ) {
        layout.children?.push(route);
        break;
      }

      layoutRouteStack.pop();
    }

    if (!layoutRouteStack.length) {
      routes.push(route);
    }

    if (page.isLayout) {
      layoutRouteStack.push(route);
    }
  }

  return routes;
}

function generateRoutesCode(
  viteConfig: ResolvedConfig,
  pages: Page[],
  ssr?: boolean
): string {
  const routes = createRoutes(pages);
  const rootLayout = routes[0]?.children ? routes[0] : null;

  let importsCode = '';
  let componentIndex = 0;

  let routesCode = JSON.stringify(routes, null, 2).replace(
    /( *)"component":\s"(.*?)"/g,
    (_str: string, space: string, component: string) => {
      const localName = `__Route__${componentIndex++}`;
      const localNameStar = `${localName}__star`;

      if (ssr || (rootLayout && component === rootLayout.component)) {
        importsCode += [
          `import * as ${localNameStar} from '${component}';`,
          `const ${localName} = enhance(${localNameStar})\n`,
        ].join('\n');
      } else {
        importsCode += `const ${localName} = enhance(() => import('${component}'));\n`;
      }

      return `${space}"component": ${localName},\n${space}"element": <${localName}.component />`;
    }
  );

  routesCode = `import React from 'react';
${generateEnhanceCode(viteConfig)}
${importsCode}
export const routes = ${routesCode};
export default routes;
`;

  return routesCode;
}
