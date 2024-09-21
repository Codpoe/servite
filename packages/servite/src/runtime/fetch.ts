import { FetchOptions as _FetchOptions, $fetch } from 'ofetch';
import type { HTTPMethod } from 'vinxi/http';

export * from 'ofetch';

export interface FetchOptions extends _FetchOptions {
  method?: HTTPMethod | Lowercase<HTTPMethod>;
}

export type CustomFetch = (url: string, options?: FetchOptions) => Promise<any>;

let _fetch: CustomFetch = (url, options) => {
  if (import.meta.env.SSR) {
    return import('vinxi/http').then(({ getEvent, fetchWithEvent }) => {
      const event = getEvent();
      return fetchWithEvent(event, url, options as any, {
        fetch: (globalThis.$fetch || $fetch) as any,
      });
    });
  }

  return $fetch(url, options);
};

export function getFetch(): CustomFetch {
  return _fetch;
}

export function setFetch(fetch: CustomFetch) {
  _fetch = fetch;
}
