import { FetchOptions as _FetchOptions, $fetch as _$fetch } from 'ofetch';
import type { HTTPMethod } from 'vinxi/http';

// eslint-disable-next-line import-x/export
export * from 'ofetch';

export interface FetchOptions extends _FetchOptions {
  method?: HTTPMethod | Lowercase<HTTPMethod>;
}

export type ServiteFetch = (
  url: string,
  options?: FetchOptions,
) => Promise<any>;

// eslint-disable-next-line import-x/export
export const $fetch: ServiteFetch = (url, options) => {
  if (import.meta.env.SSR) {
    return import('vinxi/http').then(({ getEvent, fetchWithEvent }) => {
      const event = getEvent();
      return fetchWithEvent(event, url, options as any, {
        fetch: (globalThis.$fetch || _$fetch) as any,
      });
    });
  }

  return _$fetch(url, options);
};

// eslint-disable-next-line import-x/export
export const ofetch = $fetch;

let _fetch = $fetch;

export function getFetch(): ServiteFetch {
  return _fetch;
}

export function setFetch(fetch: ServiteFetch) {
  _fetch = fetch;
}
