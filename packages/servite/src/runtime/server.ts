import {
  defineEventHandler as _defineEventHandler,
  EventHandler,
  EventHandlerObject,
  EventHandlerRequest,
  EventHandlerResponse,
} from 'vinxi/http';
import type { FetchOptions } from 'ofetch';
import type { HtmlTag, HtmlTransformer, Middleware } from '../types/index.js';

export * from 'vinxi/http';
export type { Middleware, HtmlTag, HtmlTransformer };

export interface Logger {
  debug(...args: any[]): void;
  trace(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}

declare module 'vinxi/http' {
  export interface H3EventContext {
    /**
     * Logger utils. Can be overridden to implement custom logger
     *
     * @default `console`
     */
    logger: Logger;
    /**
     * Utils for modifying the result html of SSR.
     */
    html?: {
      inject(tags: HtmlTag | HtmlTag[]): void;
      addTransformer(fn: HtmlTransformer): void;
    };
    /**
     * Whether the request is a server endpoint request.
     */
    isServerRequest?: boolean;
    /**
     * Whether the request is a page request.
     */
    isPageRequest?: boolean;
    /**
     * Whether to use SSR
     */
    ssr?: boolean;
    /**
     * Whether the ssr fallback was successful
     */
    ssrFallback?: boolean;
    /**
     * Response for middlewares
     */
    response?: any;
  }
}

export interface EventHandlerForUnifiedInvocation<
  Args extends Record<string, any>,
  RouterParams extends Record<string, string> | undefined = undefined,
  Result = any,
> {
  (
    args: Args,
    opts?: RouterParams extends NonNullable<RouterParams>
      ? FetchOptions & { routerParams: RouterParams }
      : FetchOptions,
  ): Promise<Result>;
  raw: (
    args: Args,
    opts?: RouterParams extends NonNullable<RouterParams>
      ? FetchOptions & { routerParams: RouterParams }
      : FetchOptions,
  ) => Promise<Response>;
}

type GetRequestArgs<T extends EventHandlerRequest> =
  T['body'] extends NonNullable<T['body']>
    ? NonNullable<T['body']>
    : T['query'] extends NonNullable<T['query']>
      ? NonNullable<T['query']>
      : Record<string, any>;

export function defineEventHandler<
  Request extends EventHandlerRequest = EventHandlerRequest,
  Response = EventHandlerResponse,
>(
  handler:
    | EventHandler<Request, Response>
    | EventHandlerObject<Request, Response>,
) {
  return _defineEventHandler(
    handler,
  ) as any as EventHandlerForUnifiedInvocation<
    GetRequestArgs<Request>,
    Request['routerParams'],
    Awaited<Response>
  >;
}

export const eventHandler = defineEventHandler;

export function defineMiddleware(middleware: Middleware): Middleware {
  return middleware;
}
