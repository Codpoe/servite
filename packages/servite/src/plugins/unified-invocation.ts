import { readFile } from 'fs/promises';
import { App, Plugin } from 'vinxi';
import path from 'pathe';
import { RouterName, ServerFsRoute } from '../types/index.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type ObjectHook<T, O = {}> =
  | T
  | ({ handler: T; order?: 'pre' | 'post' | null } & O);

type GetPluginHookParams<T> =
  T extends ObjectHook<infer R>
    ? R extends (...args: any) => any
      ? Parameters<R>
      : never
    : never;

export interface UnifiedInvocationConfig {
  app: App;
  srcDir: string;
  serverDir: string;
  serverRoutesDir: string;
}

export function unifiedInvocation({
  app,
  srcDir,
  serverDir,
  serverRoutesDir,
}: UnifiedInvocationConfig): Plugin {
  let viteConfig:
    | GetPluginHookParams<NonNullable<Plugin['configResolved']>>[0]
    | undefined;

  return {
    name: 'servite-unified-invocation',
    configResolved(config) {
      viteConfig = config;
    },
    resolveId(source, importer, options) {
      if (importer?.startsWith(path.join(srcDir, '/'))) {
        const id = path.resolve(importer, source);

        if (id.startsWith(path.join(serverRoutesDir, '/'))) {
          // skip optimize server routes files
          if (options.custom?.depScan) {
            return {
              id: id,
              external: true,
            };
          }
        }

        if (id.startsWith(path.join(serverDir, '/'))) {
          viteConfig?.logger.warn(
            `[servite] Importing server code outside the server directory may not be a good practice.\n  importer: ${importer}\n  source: ${source}`,
          );
        }
      }
    },
    async load(id, options) {
      if (id.startsWith(path.join(serverRoutesDir, '/'))) {
        const relPath = path.relative(process.cwd(), id);
        const serverRouter = app.getRouter(RouterName.Server);
        const route = serverRouter.internals.routes?.toRoute(id) as
          | ServerFsRoute
          | null
          | undefined;

        if (!route?.method) {
          throw new Error(
            `[servite] This module is not an api endpoint: ${relPath}`,
          );
        }

        const originalCode = await readFile(id, 'utf-8');
        const enumCode = getExportEnumCode(originalCode);
        const apiName = getApiName(route);

        return `import { getFetch } from 'servite/runtime/fetch';
${options?.ssr ? `import { getRequestHeader, getRequestProtocol, getRequestHost } from 'servite/runtime/server';` : ''}

globalThis.__META_ENV_SSR__ ??= __META_ENV_SSR__;

${enumCode}

export default function ${apiName}(args, { routerParams = {}, ...opts } = {}) {
  const apiPath = '${route.routePath}'.replace(/\\/:([^/]+)/g, (_, name) => {
    const param = routerParams[name];

    if (param != null) {
      return '/' + param;
    }
    throw new Error('Missing router param:' + name);
  });

  const origin = ${options?.ssr ? `getRequestHeader('Referer') || getRequestProtocol() + '://' + getRequestHost({ xForwardedHost: true })` : 'window.location.origin'}
  let baseURL = import.meta.env.SERVER_BASE;

  ${
    options?.ssr
      ? `if (!getRequestHeader('x-nitro-prerender')) {
    baseURL = new URL(baseURL, origin).href
    }`
      : 'baseURL = new URL(baseURL, origin).href'
  }

  return getFetch()(apiPath, {
    baseURL,
    method: '${route.method}',
    ${route.method.toUpperCase() === 'GET' ? 'query: args' : 'body: args'},
    ...opts,
  });
}

${apiName}.raw = (args, opts) => {
  return ${apiName}(args, { ...opts, _raw: true });
};

${apiName}.routePath = '${route.routePath}';
`;
      }
    },
  };
}

function getApiName({ method = 'get', routePath }: ServerFsRoute) {
  let name = method.toLowerCase();

  name += (routePath.match(/[A-Za-z0-9]+/g) || ['index'])
    .map(x => x[0].toUpperCase() + x.substring(1))
    .join('');

  return name;
}

function getExportEnumCode(code: string) {
  return (
    code.match(/^\s*export\s+(const\s+)?enum.*?\{[\s\S]*?\}/gm)?.join('\n') ||
    ''
  );
}
