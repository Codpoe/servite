import { parse } from 'url';
import { ViteDevServer } from 'vite';
import express, { Express } from 'express';
import { ssr } from './ssr.js';

export { ssr };

export interface CreateServerAppConfig {
  resolve: (...paths: string[]) => string;
  viteDevServer?: ViteDevServer;
  ssr?: boolean;
  base?: string;
}

export function createServerApp(config: CreateServerAppConfig): Express {
  const { resolve, viteDevServer, ssr: useSSR = true, base } = config;

  const app = express();

  if (viteDevServer) {
    app.use((req, _res, next) => {
      viteDevServer.config.logger.info(`servite accepts ${req.url}`, {
        timestamp: true,
      });
      next();
    });
  }

  app.get('/__server-app', (_, res) => {
    res.send({ 'powered-by': 'express' });
  });

  // ssr
  if (useSSR) {
    app.get('*', async (req, res, next) => {
      if (res.writableEnded) {
        return next();
      }

      let pathname = parse(req.url).pathname!;

      if (base && base !== '/') {
        pathname = pathname.substring(base.length);
      }

      const html = await ssr({
        pathname,
        originalUrl: req.originalUrl,
        resolve,
        viteDevServer,
      });

      if (!html) {
        return next();
      }

      viteDevServer?.config.logger.info(`servite ssr ${req.url}`, {
        timestamp: true,
      });

      return res.send(html);
    });
  }

  return app;
}
