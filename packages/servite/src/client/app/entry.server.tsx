import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { sendRedirect, sendWebResponse, toWebRequest } from 'h3';
import customRender from 'virtual:servite/custom-server-render';
import { islands } from 'virtual:servite-dist/jsx/jsx-runtime';
import { islands as devIslands } from 'virtual:servite-dist/jsx/jsx-dev-runtime';
import type {
  SSREntry,
  SSREntryRender,
  SSREntryRenderResult,
} from '../../shared/types.js';
import { routes } from './routes.js';
import { isBrowser } from './constants.js';

export { routes };

export const routerHandler: SSREntry['routerHandler'] =
  createStaticHandler(routes);

export const render: SSREntryRender = async context => {
  // We need to reset the array before rendering
  // to avoid confusion of the array from the previous render
  islands.length = 0;
  devIslands.length = 0;

  const { event } = context.ssrContext;

  // Load data by executing all of the matched route loaders
  const routerContext = await routerHandler.query(toWebRequest(event));

  if (routerContext instanceof Response) {
    if ([301, 302, 303, 307, 308].includes(routerContext.status)) {
      await sendRedirect(
        event,
        routerContext.headers.get('Location')!,
        routerContext.status
      );
      return;
    }

    await sendWebResponse(event, routerContext);
    return;
  }

  const router = createStaticRouter(routerHandler.dataRoutes, routerContext);

  const element = (
    <HelmetProvider context={context?.helmetContext}>
      <Helmet defaultTitle={(isBrowser && document.title) || 'Servite App'} />
      <StaticRouterProvider router={router} context={routerContext} />
    </HelmetProvider>
  );

  const { appHtml, headTags } = await (customRender || fallbackRender)(element);

  context.routerContext = routerContext;

  // `islandComponents` are filled during rendering.
  // add islandComponents in context
  // so that server/runtime/renderer can render the island components script
  context.islands = islands.concat(devIslands);

  return { appHtml, headTags };
};

export { pages } from 'virtual:servite/pages';

function fallbackRender(element: ReactElement): SSREntryRenderResult {
  return {
    appHtml: renderToString(element),
  };
}
