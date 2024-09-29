import {
  defineEventHandler as _defineEventHandler,
  EventHandler,
  EventHandlerObject,
  EventHandlerRequest,
  EventHandlerResponse,
} from 'vinxi/http';
import type { FetchOptions } from 'ofetch';
import type { findRoute } from 'rou3';
import type { FsRouteMod, HtmlTag } from '../types/index.js';

export * from 'vinxi/http';
export type { HtmlTag };

export interface Logger {
  debug(...args: any[]): void;
  trace(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}

export interface HtmlTransformer {
  (html: string): string | Promise<string>;
}

declare module 'vinxi/http' {
  export interface H3EventContext {
    /**
     * Internal used to store the matched server fs route.
     */
    _matchedServerFsRoute?: ReturnType<typeof findRoute<FsRouteMod>>;
    /**
     * Logger utils. Can be overridden to implement custom logger
     *
     * @default `console`
     */
    logger: Logger;
    /**
     * Utils for modifying the template of SSR.
     */
    template?: {
      /**
       * Internal used to store the tags for template injection.
       */
      _injectTags?: HtmlTag[];
      inject(tags: HtmlTag | HtmlTag[]): void;
    };
    /**
     * Utils for modifying the result html of SSR.
     */
    html?: {
      /**
       * Internal used to store the tags for html injection.
       */
      _injectTags?: HtmlTag[];
      inject(tags: HtmlTag | HtmlTag[]): void;
      /**
       * Internal used to store the transformers for html.
       */
      _transformers?: HtmlTransformer[];
      addTransformer(fn: HtmlTransformer): void;
    };
    /**
     * Whether to use SSR
     */
    ssr?: boolean;
    /**
     * Whether the ssr fallback was successful
     */
    ssrFallback?: boolean;
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
  return _defineEventHandler(handler) as EventHandlerForUnifiedInvocation<
    GetRequestArgs<Request>,
    Request['routerParams'],
    Awaited<Response>
  >;
}

export const eventHandler = defineEventHandler;
