import {
  defineEventHandler as _defineEventHandler,
  EventHandler,
  EventHandlerObject,
  EventHandlerRequest,
  EventHandlerResponse,
  getRequestHeader,
} from 'vinxi/http';
import type { FetchOptions } from 'ofetch';

export * from 'vinxi/http';

getRequestHeader('Referer');

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
