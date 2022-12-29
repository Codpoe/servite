import { isMainThread } from 'worker_threads';
import path from 'upath';
import fs from 'fs-extra';
import { build, createDevServer, Nitro, prepare } from 'nitropack';
import { H3Event } from 'h3';
import { Plugin, ResolvedConfig } from 'vite';
import { ApiHandler, ServiteConfig } from '../types.js';
import { initNitro } from './init.js';

export interface ServiteNitroPluginConfig {
  serviteConfig: ServiteConfig;
}

export function serviteNitro({
  serviteConfig,
}: ServiteNitroPluginConfig): Plugin[] {
  let viteConfig: ResolvedConfig;
  let nitro: Nitro;

  return [
    {
      name: 'servite:nitro-server',
      enforce: 'post',
      async configResolved(config) {
        viteConfig = config;

        nitro = await initNitro({
          serviteConfig,
          viteConfig,
          nitroConfig: { dev: config.command === 'serve', logLevel: 2 },
        });
      },
      async configureServer(server) {
        // Only configure server in main thread, not worker thread
        if (!isMainThread) {
          return;
        }

        const nitroDevServer = createDevServer(nitro);
        // Prepare directories
        await prepare(nitro);
        // Build dev server
        const buildPromise = build(nitro);

        return () => {
          server.middlewares.use(async (req, res, next) => {
            if (res.writableEnded) {
              return next();
            }

            // Set url for custom server
            if (req.originalUrl) {
              req.url = req.originalUrl;
            }

            await buildPromise;

            try {
              await nitroDevServer.app.handler(new H3Event(req, res));
            } catch (err) {
              res.statusCode = 500;

              if (err instanceof Error) {
                res.end(err.stack || err.message);
              } else {
                res.end('Unknown error');
              }
            }
          });
        };
      },
      async closeBundle() {
        await nitro?.close();
      },
    },
    {
      name: 'servite:nitro-integrate-api-call',
      enforce: 'pre',
      resolveId(source, importer, opts) {
        if (opts?.custom?.depScan) {
          const id = path.resolve(importer || '', source);

          // Skip optimize server file
          if (id.startsWith(nitro.options.srcDir)) {
            return {
              id,
              external: true,
            };
          }
        }
      },
      async load(id) {
        if (id.startsWith(nitro.options.srcDir)) {
          const serverRoute = id.substring(nitro.options.srcDir.length);
          const relPath = path.relative(viteConfig.root, id);

          if (
            !/^\/(api|routes)\//.test(serverRoute) ||
            !/\.(js|cjs|mjs|ts)$/.test(id)
          ) {
            throw new Error(
              `[servite] This module is not an api endpoint: ${relPath}`
            );
          }

          if (/\[.*?\]/.test(id)) {
            throw new Error(
              `[servite] Currently api endpoint does not support dynamic route: ${relPath}`
            );
          }

          const originalCode = await fs.readFile(id, 'utf-8');

          if (!hasApiHandlerCode(originalCode)) {
            throw new Error(
              `[servite] Please use "defineApiHandler" or "apiHandler" to define the api endpoint: ${relPath}`
            );
          }

          const handler = getHandler(serverRoute);
          const { generateCode, fetchImportSource } = serviteConfig.api || {};

          if (generateCode) {
            return generateCode(handler, originalCode);
          }

          const apiName = getApiName(handler);
          const url = path.join(nitro.options.baseURL, handler.route);
          const method = (handler.method || 'get').toLowerCase();

          return `${
            fetchImportSource
              ? `import _fetch from '${fetchImportSource}';`
              : `import { ofetch as _fetch } from 'servite/client';`
          }

${getExportEnumCode(originalCode)}

export default function ${apiName}(args, options) {
  return _fetch('${url}', {
    method: '${method}',
    ${method === 'get' ? 'query: args' : 'body: args'},
    ...options,
  });
}
`;
        }
      },
    },
  ];
}

function hasApiHandlerCode(code: string) {
  return (
    code.includes('defineApiHandler') ||
    code.includes('apiHandler') ||
    code.includes('defineCachedApiHandler') ||
    code.includes('cachedApiHandler')
  );
}

const httpMethodRegex =
  /\.(connect|delete|get|head|options|patch|post|put|trace)/;

function getHandler(id: string): ApiHandler {
  let method = 'get';
  let route = path.trimExt(id.replace(/^\/routes/, ''));

  const methodMatch = route.match(httpMethodRegex);

  if (methodMatch) {
    route = route.slice(0, Math.max(0, methodMatch.index!));
    method = methodMatch[1];
  }

  route = route.replace(/\/index$/, '') || '/';

  return {
    method,
    route,
  };
}

// / -> <method>Index
// /foo/bar -> <method>FooBar
function getApiName({ method = 'get', route = '/' }: ApiHandler) {
  let name = method.toLowerCase();

  name += (route.match(/[A-Za-z0-9]+/g) || ['index'])
    .map(x => x[0].toUpperCase() + x.substring(1))
    .join('');

  return name;
}

function getExportEnumCode(code: string) {
  return code.match(/^export\s+enum.*?\{[\s\S]*?\}/m)?.[0] || '';
}
