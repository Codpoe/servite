import path from 'upath';
import fs from 'fs-extra';
import { Plugin, ResolvedConfig, transformWithEsbuild } from 'vite';
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
import { Page, Route, ServiteConfig } from '../types.js';
import { generateEnhanceCode } from './enhance.js';

interface RoutesConfig extends Partial<Pick<ServiteConfig, 'pagesDir'>> {}

export function routes({ pagesDir = 'src/pages' }: RoutesConfig = {}): Plugin {
  let viteConfig: ResolvedConfig;
  let findPagesPromise: Promise<Page[]> | null = null;
  let pages: Page[] = [];

  return {
    name: 'servite:routes',
    // TODO: optimize deps for routes
    configResolved(config) {
      viteConfig = config;

      findPagesPromise ??= findPages(viteConfig.root, pagesDir);
    },
    async buildStart() {
      if (!findPagesPromise) {
        findPagesPromise = findPages(viteConfig.root, pagesDir);
      }
      pages = await findPagesPromise;
    },
    closeBundle() {
      findPagesPromise = null;
      pages = [];
    },
    resolveId(source) {
      if (source === PAGES_MODULE_ID) {
        return RESOLVED_PAGES_MODULE_ID;
      }
      if (source === ROUTES_MODULE_ID) {
        return RESOLVED_ROUTES_MODULE_ID;
      }
    },
    load(id, opts) {
      if (id === RESOLVED_PAGES_MODULE_ID) {
        return `export const pages = ${JSON.stringify(
          sortPages(pages),
          null,
          2
        )};
export default pages
`;
      }
      if (id === RESOLVED_ROUTES_MODULE_ID) {
        return transformWithEsbuild(
          generateRoutesCode(viteConfig, pages, opts?.ssr),
          RESOLVED_ROUTES_MODULE_ID,
          { loader: 'jsx' }
        );
      }
    },
    handleHotUpdate(ctx) {
      const filePath = path.normalize(ctx.file);
      const modules = [...ctx.modules];

      if (
        filePath.startsWith(path.join(pagesDir, '/')) &&
        mm.isMatch(filePath, PAGE_PATTERN, {
          cwd: path.resolve(viteConfig.root, pagesDir),
          ignore: IGNORE_PATTERN,
        })
      ) {
        modules.push(
          ...(ctx.server.moduleGraph.getModulesByFile(
            RESOLVED_PAGES_MODULE_ID
          ) || [])
        );
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
  const extname = path.extname(pageFile);
  const isMarkdown = extname === '.md' || extname === '.mdx';
  const routePath = resolveRoutePath(pageFile, isMarkdown);
  const filePath = path.join(pagesDir, pageFile);
  const fileContent = fs.readFileSync(path.resolve(root, filePath), 'utf-8');
  const exports = resolvePageExports(fileContent);
  const meta = resolvePageMeta(fileContent, isMarkdown);

  return {
    routePath,
    filePath,
    isLayout: basename === 'layout',
    is404: basename === '404',
    exports,
    meta,
  };
}

function resolveRoutePath(pageFile: string, isMarkdown: boolean) {
  let routePath = path
    .trimExt(path.join('/', pageFile))
    .replace(/\/404$/, '/*') // transform '/404' to '/*' so this route acts like a catch-all for URLs that we don't have explicit routes for
    .replace(/\/\[\.{3}.*?\]$/, '/*') // transform '/post/[...all]' to '/post/*'
    .replace(/\/\[(.*?)\]/g, '/:$1'); // transform 'user/[id]' to 'user/:id'

  if (isMarkdown) {
    routePath = routePath
      .replace(/^(\/index){1,2}$/, '') // remove '/index'
      .replace(/\/README$/i, ''); // remove '/README'
  } else {
    routePath = routePath.replace(/\/(page|layout)$/, ''); // remove '/page' and '/layout'
  }

  return routePath;
}

function resolvePageExports(fileContent: string): string[] {
  const exportConst = (
    fileContent.match(/^\s*export\s+const\s+(.*?)=/m) || []
  ).map(x => x[1]);

  const exportFunction = (
    fileContent.match(/^\s*export\s+function\s+(.*?)\s*\(/m) || []
  ).map(x => x[1]);

  return exportConst.concat(exportFunction);
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
  let index = 0;

  let routesCode = JSON.stringify(routes, null, 2).replace(
    /( *)"component":\s"(.*?)"/g,
    (_str: string, space: string, component: string) => {
      const localName = `__Route__${index++}`;
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
