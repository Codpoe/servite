import path from 'upath';
import fs from 'fs-extra';
import fg from 'fast-glob';
import mm from 'micromatch';
import matter from 'gray-matter';
import { extract, parse } from 'jest-docblock';
import { debounce } from 'perfect-debounce';
import type { ResolvedConfig } from 'vite';
import { parse as esModuleLexer } from 'es-module-lexer';
import type { Page, Route } from '../../shared/types.js';
import { isMarkdown } from '../utils.js';
import type { PagesDir, ServiteConfig } from '../types.js';
import {
  PAGES_DATA_MODULE_ID,
  PAGES_IGNORE_PATTERN,
  PAGES_PATTERN,
  SCRIPT_EXTS,
} from '../constants.js';
import routesLazyFactoryCode from '../../prebuild/routes-lazy-factory.prebuilt.js';
import routesFetchDataCode from '../../prebuild/routes-fetch-data.prebuilt.js';
import routesHmrCode from '../../prebuild/routes-hmr.prebuilt.js';

export class PagesManager {
  private reloadPromise: Promise<Page[]> | null = null;

  constructor(
    private viteConfig: ResolvedConfig,
    private serviteConfig: ServiteConfig
  ) {
    this.reload();
  }

  reload = () => {
    return (this.reloadPromise = debouncedScanPages(
      this.viteConfig,
      this.serviteConfig
    ));
  };

  getPages = async () => {
    return (await this.reloadPromise) || [];
  };

  getRoutes = async () => createRoutes(await this.getPages());

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
    const routes = await this.getRoutes();
    const rootLayout = routes[0]?.children ? routes[0] : null;

    let importsCode = '';
    let hasInjectedDataImport = false;

    let routesCode = JSON.stringify(routes, null, 2)
      .replace(
        /"__LAZY_PLACEHOLDER__":\s"(.*?)"/g,
        (_str: string, filePath: string) => {
          if (rootLayout && filePath === rootLayout.filePath) {
            importsCode += `import * as rootLayoutModule from '/${filePath}';\n`;
            return `"lazy": lazyFactory(rootLayoutModule)`;
          }

          return `"lazy": lazyFactory(() => import('/${filePath}'))`;
        }
      )
      .replace(
        /"__(LOADER|ACTION)_PLACEHOLDER__":\s"(.*?)"/g,
        (_str: string, type: 'LOADER' | 'ACTION', dataFilePath: string) => {
          if (!hasInjectedDataImport) {
            importsCode += `import { data as importedData } from '${PAGES_DATA_MODULE_ID}';\n`;
            hasInjectedDataImport = true;
          }

          const key = type === 'LOADER' ? 'loader' : 'action';

          return `"${key}": data['${dataFilePath}']?.${key}`;
        }
      );

    routesCode = `${importsCode}

${routesLazyFactoryCode}

${hasInjectedDataImport ? 'let data = importedData;' : ''}

export const routes = ${routesCode};
export default routes;


${routesHmrCode}
`;

    if (write) {
      await writeFile(this.viteConfig!, 'pages-routes.js', routesCode);
    }

    return routesCode;
  };

  generatePagesDataCode = async (useApi: boolean) => {
    const pages = await this.getPages();
    const imports: string[] = [];
    const apis: string[] = [];
    const dataFileToNames: [string, string][] = [];

    pages
      .filter(page => page.dataFilePath)
      .forEach((page, index) => {
        const dataName = `data_${index}`;

        dataFileToNames.push([page.dataFilePath!, dataName]);

        if (useApi) {
          const loaderOrActionCode = `async ({ request }) => fetchRouteData(request, '${page.filePath}')`;
          apis.push(`const ${dataName} = {
  ${page.hasLoader ? `loader: ${loaderOrActionCode},` : ''}
  ${page.hasAction ? `action: ${loaderOrActionCode},` : ''}
};`);
        } else {
          imports.push(
            `import * as ${dataName} from '/${page.dataFilePath!}';`
          );
        }
      });

    return `${imports.join('\n')}

${apis.length ? `${routesFetchDataCode}\n\n${apis.join('\n')}` : ''}

export const data = {
${dataFileToNames
  .map(([dataFilePath, dataName]) => `  ['${dataFilePath}']: ${dataName},`)
  .join('\n  ')}
};
`;
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

  checkDataFile = (absFilePath: string) => {
    const isInPagesDir = this.serviteConfig.pagesDirs.some(({ dir }) => {
      const prefixPath = path.join(
        path.resolve(this.viteConfig.root, dir),
        '/'
      );
      return absFilePath.startsWith(prefixPath);
    });

    return isInPagesDir && /(page|layout)\.data\.(j|t)sx?/.test(absFilePath);
  };
}

const debouncedScanPages = debounce(scanPages, 50);

async function scanPages(
  viteConfig: ResolvedConfig,
  serviteConfig: ServiteConfig
): Promise<Page[]> {
  function createPage(base: string, pageDir: string, pageFile: string): Page {
    const basename = path.basename(path.trimExt(pageFile));
    const routePath = resolveRoutePath(base, pageFile);
    const absFilePath = path.join(pageDir, pageFile);
    const filePath = path.relative(viteConfig.root, absFilePath);
    const { dataFilePath, hasLoader, hasAction } =
      findDataFile(viteConfig.root, filePath, basename) || {};

    return {
      routePath,
      filePath,
      dataFilePath,
      hasLoader,
      hasAction,
      isLayout: basename === 'layout',
      is404: basename === '404',
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

    return pageFiles.map(pageFile => createPage(base, pageDir, pageFile));
  }

  return (await Promise.all(serviteConfig.pagesDirs.map(scan)))
    .flat()
    .sort((a, b) => {
      const compareRes = path
        .dirname(a.filePath)
        .localeCompare(path.dirname(b.filePath));

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
    .replace(/\/\[(.*?)\]/g, '/:$1') // transform '/user/[id]' to '/user/:id'
    .replace(/\/\(.*?\)/g, ''); // transform '/(marketing)/about' to '/about'

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
    const route: Route = {
      id: page.filePath,
      path: page.routePath,
      children: page.isLayout ? [] : undefined,
      filePath: page.filePath,
      dataFilePath: page.dataFilePath,
      __LAZY_PLACEHOLDER__: page.filePath,
      __LOADER_PLACEHOLDER__: page.dataFilePath,
      __ACTION_PLACEHOLDER__: page.dataFilePath,
    };

    const routeDir = path.dirname(route.filePath);

    while (layoutRouteStack.length) {
      const layout = layoutRouteStack[layoutRouteStack.length - 1];
      const layoutDir = path.dirname(layout.filePath);

      // - root layout
      // - same level layout
      // - sub level layout
      if (
        layoutDir === '.' ||
        layoutDir === routeDir ||
        routeDir.startsWith(layoutDir + '/')
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

function findDataFile(
  root: string,
  pageFile: string,
  name: string
): { dataFilePath?: string; hasLoader: boolean; hasAction: boolean } {
  for (const ext of SCRIPT_EXTS) {
    const dataFilePath = path.join(
      path.dirname(pageFile),
      `${name}.data${ext}`
    );
    const absDataFilePath = path.join(root, dataFilePath);

    if (fs.existsSync(absDataFilePath)) {
      const [, exports] = esModuleLexer(
        fs.readFileSync(absDataFilePath, 'utf-8')
      );
      const exportNames = exports.map(e => e.n);

      return {
        dataFilePath,
        hasLoader: exportNames.includes('loader'),
        hasAction: exportNames.includes('action'),
      };
    }
  }

  return { hasLoader: false, hasAction: false };
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
