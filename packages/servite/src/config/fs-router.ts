import { existsSync } from 'node:fs';
import { posix } from 'node:path';
import path from 'pathe';
import {
  BaseFileSystemRouter,
  FileSystemRouterConfig,
  cleanPath,
  analyzeModule,
} from 'vinxi/fs-router';
import { AppOptions } from 'vinxi';
import fg from 'fast-glob';
import { extractFrontmatter } from '../utils/md.js';
import { PageFsRoute, ServerFsRoute } from '../types/index.js';

interface PageInfo {
  isMd?: boolean;
  isLayout?: boolean;
  componentPick?: string[];
  dataPick?: string[];
}

interface PageFsRouterConfig extends FileSystemRouterConfig {
  base: string;
}

// react-router pages
export class PagesFsRouter extends BaseFileSystemRouter {
  config: PageFsRouterConfig;
  srcToPageInfo: Record<string, PageInfo> = {};

  constructor(config: PageFsRouterConfig, router: any, app: AppOptions) {
    super(config, router, app);
    this.config = config;
  }

  toPath(src: string): string {
    let routePath = cleanPath(src, this.config);

    // markdown
    if (src.endsWith('.md') || src.endsWith('.mdx')) {
      this.srcToPageInfo[src] = { isMd: true };
      routePath = routePath.replace(/\/index$/, '').replace(/\/README$/i, '');
    } else if (routePath.endsWith('/page') || routePath.endsWith('/layout')) {
      // page or layout
      this.srcToPageInfo[src] = { isLayout: routePath.endsWith('/layout') };
      routePath = routePath.replace(/\/(page|layout)$/, '');
    } else {
      return '';
    }

    routePath = routePath
      // '/user/[...]' -> '/user/*'
      .replace(/\/\[\.{3}.*?\]$/, '/*')
      // '/user/[id]' -> '/user/:id'
      // '/user/[[id]]' -> '/user/:id?'
      .replace(/\/\[(\[?.+?\]?)\]/g, (_, m: string) => {
        // optional
        if (m.startsWith('[') && m.endsWith(']')) {
          return `/:${m.slice(1, -1)}?`;
        }
        // dynamic
        return `/:${m}`;
      })
      // '/(admin)/home' -> '/home'
      .replace(/\/\(.*?\)/g, '');

    return path.join(this.config.base, routePath);
  }

  toRoute(src: string): PageFsRoute | null {
    const routePath = this.toPath(src);

    if (!routePath) {
      return null;
    }

    const pageInfo = this.srcToPageInfo[src];
    const componentPick: string[] = ['default', '$css'];
    const dataPick: string[] = [];
    const handlePick: string[] = [];
    let frontmatter: Record<string, any> | undefined = undefined;
    let dataFilePath: string | undefined = undefined;

    if (pageInfo.isMd) {
      frontmatter = extractFrontmatter(src);
    } else {
      const [, exports] = analyzeModule(src);

      if (!exports.some(x => x.n === 'default')) {
        return null;
      }

      for (const { n } of exports) {
        if (n === 'ErrorBoundary') {
          componentPick.push(n);
        } else if (n === 'handle') {
          handlePick.push(n);
        }
      }

      const dir = path.dirname(src);

      for (const ext of this.config.extensions) {
        const _dataFilePath = path.join(
          dir,
          `${pageInfo.isLayout ? 'layout' : 'page'}.data.${ext}`,
        );
        if (existsSync(_dataFilePath)) {
          dataFilePath = _dataFilePath;
          break;
        }
      }

      if (dataFilePath) {
        const [, dataExports] = analyzeModule(dataFilePath);

        if (dataExports.some(x => x.n === 'loader')) {
          dataPick.push('loader');
        }

        if (dataExports.some(x => x.n === 'action')) {
          dataPick.push('action');
        }
      }
    }

    pageInfo.componentPick = componentPick;
    pageInfo.dataPick = dataPick;

    return {
      path: src,
      routePath,
      filePath: src,
      isMd: pageInfo.isMd,
      isLayout: pageInfo.isLayout,
      hasErrorBoundary: componentPick.includes('ErrorBoundary'),
      hasLoader: dataPick.includes('loader'),
      hasAction: dataPick.includes('action'),
      handle: {
        frontmatter,
      },
      $component: {
        src,
        pick: componentPick,
      },
      ...(dataPick.length > 0 && {
        $data: {
          src: dataFilePath!,
          pick: dataPick,
        },
      }),
      ...(handlePick.length > 0 && {
        $$handle: {
          src,
          pick: handlePick,
        },
      }),
    };
  }

  async getRoutes(): Promise<PageFsRoute[]> {
    // sort routes
    return ((await super.getRoutes()) as PageFsRoute[]).slice().sort((a, b) => {
      const compareRes = path
        .dirname(a.filePath)
        .localeCompare(path.dirname(b.filePath));

      // layout first
      if (compareRes === 0) {
        if (a.isLayout && b.isLayout) {
          return 0;
        }
        return a.isLayout ? -1 : 1;
      }

      return compareRes;
    });
  }

  async updateRoute(src: string) {
    src = path.normalize(src);

    // if it's a data file, just reload.
    if (this.isDataFile(src)) {
      this.reload(undefined as any);
      return;
    }

    if (this.isRoute(src)) {
      try {
        const originalPageInfo = this.srcToPageInfo[src];
        const route = await this.toRoute(src);

        if (route) {
          this._addRoute(route);

          // if the exports of route file is changed, reload the route.
          // otherwise, just let react-refresh to handle hmr.
          if (
            originalPageInfo.componentPick?.toString() !==
            this.srcToPageInfo[src].componentPick?.toString()
          ) {
            this.reload(route as any);
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  }

  reload = (() => {
    let timer: any;

    return (route: any) => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => super.reload(route), 0);
    };
  })();

  isDataFile(src: string) {
    src = cleanPath(src, this.config);
    return src.endsWith('page.data') || src.endsWith('layout.data');
  }
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

interface ServerFsRouterConfig extends FileSystemRouterConfig {
  middlewaresDir?: string;
  base: string;
}

// server routes
export class ServerFsRouter extends BaseFileSystemRouter {
  config: ServerFsRouterConfig;

  constructor(config: ServerFsRouterConfig, router: any, app: AppOptions) {
    super(config, router, app);
    this.config = config;
  }

  isMiddleware(src: string): boolean {
    return Boolean(
      this.config.middlewaresDir && src.startsWith(this.config.middlewaresDir),
    );
  }

  getHttpMethod(src: string): string | undefined {
    if (this.isMiddleware(src)) {
      return undefined;
    }

    const [, method] = cleanPath(src, this.config).match(/\.([^./]+)$/) || [];

    if (!method || !HTTP_METHODS.includes(method.toUpperCase())) {
      return undefined;
    }

    return method.toUpperCase();
  }

  glob(): any {
    const patterns = [
      posix.join(
        fg.convertPathToPattern(this.config.dir),
        `**/*.{${this.config.extensions.join(',')}}`,
      ),
    ];

    if (this.config.middlewaresDir) {
      patterns.push(
        posix.join(
          fg.convertPathToPattern(this.config.middlewaresDir),
          `*.{${this.config.extensions.join(',')}}`,
        ),
        posix.join(
          fg.convertPathToPattern(this.config.middlewaresDir),
          `*/index.{${this.config.extensions.join(',')}}`,
        ),
      );
    }

    return patterns;
  }

  toPath(src: string): string {
    if (this.isMiddleware(src)) {
      return '/**';
    }

    const method = this.getHttpMethod(src);

    // server routes need append with http method
    // eg. '/user.get.ts', '/user.post.ts'
    if (!method) {
      return '';
    }

    let routePath = cleanPath(src, this.config);

    routePath = routePath
      // '/user.get' -> '/user'
      .slice(0, -method.length - 1)
      // '/user/index' -> '/user'
      .replace(/\/index$/, '')
      // '/user/[...]' -> '/user/**'
      .replace(/\/\[\.{3}.*?\]$/, '/**')
      // '/user/[id]' -> '/user/:id'
      .replace(/\/\[(.+?)\]/g, '/:$1');

    return path.join(this.config.base, routePath);
  }

  toRoute(src: string): ServerFsRoute | null {
    const routePath = this.toPath(src);

    if (!routePath) {
      return null;
    }

    const [, exports] = analyzeModule(src);

    if (!exports.some(x => x.n === 'default')) {
      return null;
    }

    return {
      path: src,
      routePath,
      filePath: src,
      method: this.getHttpMethod(src),
      [this.isMiddleware(src) ? '$$middleware' : '$handler']: {
        src,
        pick: ['default'],
      },
    };
  }
}
