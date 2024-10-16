import { FetchOptions as _FetchOptions, $fetch as _$fetch } from 'ofetch';
import type { HTTPMethod } from 'vinxi/http';

// eslint-disable-next-line import-x/export
export * from 'ofetch';

export interface FetchOptions extends _FetchOptions {
  method?: HTTPMethod | Lowercase<HTTPMethod>;
  _raw?: boolean;
}

export interface ServiteFetch {
  <T = any>(url: string, options?: FetchOptions): Promise<T>;
  raw: (url: string, options?: FetchOptions) => Promise<Response>;
}

// eslint-disable-next-line import-x/export
export const $fetch: ServiteFetch = (url, options) => {
  if (import.meta.env.ROUTER_NAME !== 'client') {
    return import('vinxi/http').then(({ getEvent, fetchWithEvent }) => {
      const event = getEvent();
      let fetch: any = globalThis.$fetch || _$fetch;

      if (options?._raw) {
        fetch = fetch.raw;
      }

      return fetchWithEvent(event, url, options as any, {
        fetch,
      });
    });
  }

  const fetch = options?._raw ? _$fetch.raw : _$fetch;
  return fetch(url, options);
};

$fetch.raw = (url, options) => {
  return $fetch(url, { ...options, _raw: true });
};

// eslint-disable-next-line import-x/export
export const ofetch = $fetch;

let _fetch = $fetch;

export function getFetch(): ServiteFetch {
  return _fetch;
}

interface CustomFetch {
  <T = any>(url: string, options?: FetchOptions): Promise<T>;
  raw?: (url: string, options?: FetchOptions) => Promise<Response>;
}

export function setFetch(fetch: CustomFetch) {
  fetch.raw ??= (url, options) => {
    return fetch(url, { ...options, _raw: true });
  };
  _fetch = fetch as ServiteFetch;
}
