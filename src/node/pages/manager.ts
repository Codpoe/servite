import path from 'upath';
import fs from 'fs-extra';
import fg from 'fast-glob';
import mm from 'micromatch';
import matter from 'gray-matter';
import { debounce } from 'perfect-debounce';
import type { ResolvedConfig } from 'vite';
import { isMarkdown } from '../utils.js';
import type { Page, PagesDirConfig, Route, ServiteConfig } from '../types.js';
import { IGNORE_PATTERN, PAGES_PATTERN } from '../constants.js';
import { generateEnhanceCode } from './enhance.js';

const PAGES_DIR = 'src/pages';

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
      this.serviteConfig.pagesDir
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
${space}"element": React.createElement(${localName}.component)`;
      }
    );

    routesCode = `import React from 'react';
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

  checkPageFile = async (filePath: string) => {
    filePath = path.relative(this.viteConfig!.root, filePath);

    const pages = await this.getPages();
    const isPageFile =
      filePath.startsWith(path.join(PAGES_DIR, '/')) &&
      mm.isMatch(filePath, PAGES_PATTERN, {
        cwd: path.resolve(this.viteConfig!.root, PAGES_DIR),
        ignore: IGNORE_PATTERN,
      });

    const isExisting = pages.some(p => filePath.endsWith(p.filePath));

    return {
      isPageFile,
      isExisting,
    };
  };
}

const debouncedScanPages = debounce(scanPages, 50);

async function scanPages(
  viteConfig: ResolvedConfig,
  pagesDir: PagesDirConfig[]
): Promise<Page[]> {
  async function _scan({
    dir,
    base = viteConfig.base,
    ignore = [],
  }: PagesDirConfig) {
    const pageFiles = await fg(
      ['**/{page,layout}.{js,jsx,ts,tsx}', '**/*.{md,mdx}'],
      {
        cwd: path.resolve(viteConfig.root, dir),
        ignore: ['**/{tests,__tests__}/**', ...ignore],
        absolute: false,
      }
    );

    return pageFiles.map(pageFile =>
      createPage(viteConfig.root, base, pageFile)
    );
  }

  return (await Promise.all(pagesDir.map(_scan))).flat().sort((a, b) => {
    const compareRes = a.routePath.localeCompare(b.routePath);
    // layout first
    return compareRes === 0 && a.isLayout ? -1 : compareRes;
  });
}

function createPage(root: string, base: string, pageFile: string): Page {
  const basename = path.basename(path.trimExt(pageFile));
  const routePath = resolveRoutePath(pageFile);
  const filePath = path.join(PAGES_DIR, pageFile);
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
    .replace(/\/\[\.{3}.*?\]$/, '/*') // transform '/post/[...]' to '/post/*'
    .replace(/\/\[(.*?)\]/g, '/:$1'); // transform 'user/[id]' to 'user/:id'

  if (isMarkdown(pageFile)) {
    routePath = routePath
      .replace(/\/index$/, '') // remove '/index'
      .replace(/\/README$/i, ''); // remove '/README'
  } else {
    routePath = routePath.replace(/\/(page|layout)$/, ''); // remove '/page' and '/layout'
  }

  return routePath || '/';
}

function extractFrontMatter(fileContent: string) {
  const { data: frontMatter, content } = matter(fileContent);

  if (!frontMatter.title) {
    const m = content.match(/^#\s+(.*)$/m);
    frontMatter.title = m?.[1];
  }

  return frontMatter;
}

function createRoutes(pages: Page[]): Route[] {
  const routes: Route[] = [];
  const layoutRouteStack: Route[] = [];

  for (const page of pages) {
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
