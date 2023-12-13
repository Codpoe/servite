import { type H3Event, getQuery, toWebRequest, setResponseHeader } from 'h3';
import { isRouteErrorResponse, json as routerJson } from 'react-router-dom';
import { UNSAFE_DEFERRED_SYMBOL } from '@remix-run/router';
import colors from 'picocolors';
import type { SSREntry } from '../../shared/types.js';
import { isRedirectResponse, isResponse } from './utils.js';
import { viteLog } from './vite.js';
import { serializeError } from './error.js';

export async function queryRouteData(event: H3Event, ssrEntry: SSREntry) {
  const routeId = getQuery(event)._data as string;

  viteLog(colors.green('nitro route data ') + colors.dim(routeId));

  try {
    let response = await ssrEntry.routerHandler.queryRoute(
      toWebRequest(event),
      {
        routeId,
      }
    );

    if (typeof response === 'undefined') {
      setResponseHeader(event, 'X-Remix-Error', 'yes');

      return routerJson(
        serializeError(
          new Error(
            `No response returned from route data handler: ${event.path}`
          )
        ),
        {
          status: 404,
        }
      );
    }

    if (isRedirectResponse(response)) {
      // We don't have any way to prevent a fetch request from following
      // redirects. So we use the `X-Remix-Redirect` header to indicate the
      // next URL, and then "follow" the redirect manually on the client.
      const headers = new Headers(response.headers);
      headers.set('X-Remix-Redirect', headers.get('Location')!);
      headers.set('X-Remix-Status', response.status);
      headers.delete('Location');

      if (response.headers.get('Set-Cookie') !== null) {
        headers.set('X-Remix-Revalidate', 'yes');
      }

      return new Response(null, {
        status: 204,
        headers,
      });
    }

    // TODO: support deferred
    if (UNSAFE_DEFERRED_SYMBOL in response) {
      setResponseHeader(event, 'X-Remix-Error', 'yes');
      return routerJson(
        serializeError(
          new Error(
            `React router "Deferred" is not supported in ssr: ${routeId}`
          )
        ),
        {
          status: 500,
        }
      );
    }

    if (!isResponse(response)) {
      response = routerJson(response);
    }

    // Mark all successful responses with a header so we can identify in-flight
    // network errors that are missing this header
    setResponseHeader(event, 'X-Remix-Response', 'yes');

    return response;
  } catch (error) {
    if (isResponse(error)) {
      setResponseHeader(event, 'X-Remix-Catch', 'yes');
      return error;
    }

    setResponseHeader(event, 'X-Remix-Error', 'yes');

    if (isRouteErrorResponse(error)) {
      return routerJson(
        serializeError(
          (error as any).error || new Error('Unexpected Server Error')
        ),
        {
          status: error.status,
          statusText: error.statusText,
        }
      );
    }

    const errorInstance =
      error instanceof Error ? error : new Error('Unexpected Server Error');
    return routerJson(serializeError(errorInstance), {
      status: 500,
    });
  }
}
