import path from 'upath';
import fs from 'fs-extra';
import fg from 'fast-glob';
import mm from 'micromatch';
import matter from 'gray-matter';
import { extract, parse } from 'jest-docblock';
import { debounce } from 'perfect-debounce';
import type { ResolvedConfig } from 'vite';
import type { Page, Route } from '../../shared/types.js';
import enhanceRouteCode from '../../prebuild/enhance-route.prebuilt.js';
import { isMarkdown } from '../utils.js';
import type { PagesDir, ServiteConfig } from '../types.js';
import { PAGES_IGNORE_PATTERN, PAGES_PATTERN } from '../constants.js';

export class PagesManager {
  private reloadPromise: Promise<Page[]> | null = null;

  constructor(
    private viteConfig: ResolvedConfig,
    private serviteConfig: ServiteConfig
  ) {
    this.reload();
  }

  reload = () => {
    this.reloadPromise = debouncedScanPages(
      this.viteConfig,
      this.serviteConfig
    );
  };

  getPages = async () => {
    return (await this.reloadPromise) || [];
  };

  generatePagesCode = async (write = false) => {
    const pages = await this.getPages();
    const code = `export const pages = ${JSON.stringify(pages, null, 2)};
export default pages;
`;

    if (write) {
      await writeFile(this.viteConfig!, 'pages.js', code);
    }

    return code;
  };

  generatePagesRoutesCode = async (write = false) => {
    const pages = await this.getPages();
    const routes = createRoutes(pages);
    const rootLayout = routes[0]?.children ? routes[0] : null;

    let importsCode = '';
    let componentIndex = 0;

    let routesCode = JSON.stringify(routes, null, 2).replace(
      /( *)"component":\s"(.*?)"/g,
      (_str: string, space: string, component: string) => {
        const localName = `__Route__${componentIndex++}`;
        const localNameStar = `${localName}__star`;

        if (rootLayout && component === rootLayout.component) {
          importsCode += [
            `import * as ${localNameStar} from '${component}';`,
            `const ${localName} = enhance(${localNameStar})\n`,
          ].join('\n');
        } else {
          importsCode += `const ${localName} = enhance(() => import('${component}'));\n`;
        }

        return `${space}"component": ${localName},
${space}"element": React.createElement(${localName}.component, null, React.createElement(Outlet))`;
      }
    );

    routesCode = `import React from 'react';
  import { Outlet } from 'servite/client';
  ${generateEnhanceCode(this.viteConfig!)}
  ${importsCode}
  export const routes = ${routesCode};
  export default routes;
  `;

    if (write) {
      await writeFile(this.viteConfig!, 'pages-routes.js', routesCode);
    }

    return routesCode;
  };

  checkPageFile = async (absFilePath: string) => {
    const isPageFile = this.serviteConfig.pagesDirs.some(
      ({ dir, ignore = [] }) => {
        const prefixPath = path.join(
          path.resolve(this.viteConfig.root, dir),
          '/'
        );

        return (
          absFilePath.startsWith(prefixPath) &&
          mm.isMatch(absFilePath.substring(prefixPath.length), PAGES_PATTERN, {
            ignore: PAGES_IGNORE_PATTERN.concat(ignore),
          })
        );
      }
    );

    const existingPage = isPageFile
      ? (await this.getPages()).find(p => absFilePath.endsWith(p.filePath))
      : undefined;

    return {
      isPageFile,
      existingPage,
    };
  };
}

const debouncedScanPages = debounce(scanPages, 50);

async function scanPages(
  viteConfig: ResolvedConfig,
  serviteConfig: ServiteConfig
): Promise<Page[]> {
  async function createPage(
    base: string,
    pageDir: string,
    pageFile: string
  ): Promise<Page> {
    const basename = path.basename(path.trimExt(pageFile));
    const routePath = resolveRoutePath(base, pageFile);
    const absFilePath = path.join(pageDir, pageFile);
    const filePath = path.relative(viteConfig.root, absFilePath);
    const fileContent = fs.readFileSync(absFilePath, 'utf-8');
    const meta = await parsePageMeta(filePath, fileContent);

    return {
      routePath,
      filePath,
      isLayout: basename === 'layout',
      is404: basename === '404',
      meta,
    };
  }

  async function scan({
    dir,
    base = '/',
    ignore = [],
  }: PagesDir): Promise<Page[]> {
    const pageDir = path.resolve(viteConfig.root, dir);

    const pageFiles = await fg(PAGES_PATTERN, {
      cwd: pageDir,
      ignore: PAGES_IGNORE_PATTERN.concat(ignore),
      absolute: false,
    });

    return Promise.all(
      pageFiles.map(pageFile => createPage(base, pageDir, pageFile))
    );
  }

  return (await Promise.all(serviteConfig.pagesDirs.map(scan)))
    .flat()
    .sort((a, b) => {
      const compareRes = a.routePath.localeCompare(b.routePath);
      // layout first
      if (compareRes === 0) {
        if (a.isLayout && b.isLayout) {
          return 0;
        }
        return b.isLayout ? 0 : -1;
      }
      return compareRes;
    });
}

function resolveRoutePath(base: string, pageFile: string) {
  let routePath = path.trimExt(path.join('/', base, pageFile));

  if (isMarkdown(pageFile)) {
    routePath = routePath
      .replace(/\/index$/, '') // remove '/index'
      .replace(/\/README$/i, ''); // remove '/README'
  } else {
    routePath = routePath.replace(/\/(page|layout)$/, ''); // remove '/page' and '/layout'
  }

  routePath = routePath
    .replace(/\/404$/, '/*') // transform '/404' to '/*' so this route acts like a catch-all for URLs that we don't have explicit routes for
    .replace(/\/\[\.{3}.*?\]$/, '/*') // transform '/post/[...]' to '/post/*'
    .replace(/\/\[(.*?)\]/g, '/:$1'); // transform '/user/[id]' to '/user/:id'

  return routePath || '/';
}

export async function parsePageMeta(filePath: string, fileContent: string) {
  // Markdown frontmatter
  if (isMarkdown(filePath)) {
    const { data: frontMatter, content } = matter(fileContent);

    if (!frontMatter.title) {
      const m = content.match(/^#\s+(.*)$/m);
      frontMatter.title = m?.[1];
    }

    return frontMatter;
  }

  // JS/TS docblock
  if (fileContent.trim().startsWith('/*')) {
    return parse(extract(fileContent));
  }

  return {};
}

function createRoutes(pages: Page[]): Route[] {
  const routes: Route[] = [];
  const layoutRouteStack: Route[] = [];

  for (const page of pages) {
    const route = {
      path: page.routePath,
      filePath: page.filePath,
      component: path.join('/', page.filePath),
      children: page.isLayout ? [] : undefined,
      meta: page.meta,
    } as Route;

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

function generateEnhanceCode(viteConfig: ResolvedConfig) {
  return `const seen = {};
const base = '${viteConfig.base}';
const assetsDir = '${viteConfig.build.assetsDir}';
${enhanceRouteCode}`;
}

async function writeFile(
  viteConfig: ResolvedConfig,
  filePath: string,
  content: string
) {
  return fs.outputFile(
    path.resolve(viteConfig.root, viteConfig.build.outDir, filePath),
    content,
    'utf-8'
  );
}
