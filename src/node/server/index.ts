import { parse } from 'url';
import { ViteDevServer } from 'vite';
import express, { Express } from 'express';
import { ssr } from './ssr.js';

export { ssr };

export interface CreateServerAppConfig {
  resolve: (...paths: string[]) => string;
  viteDevServer?: ViteDevServer;
  ssr?: boolean;
}

export function createServerApp(config: CreateServerAppConfig): Express {
  const { resolve, viteDevServer, ssr: useSSR = true } = config;

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

      const html = await ssr({
        pathname: parse(req.url).pathname!,
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
