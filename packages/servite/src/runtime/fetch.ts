import { FetchOptions, ofetch } from 'ofetch';

export * from 'ofetch';

export type CustomFetch = (url: string, options?: FetchOptions) => Promise<any>;
let _fetch: CustomFetch = ofetch;

export function getFetch(): CustomFetch {
  return _fetch;
}

export function setFetch(fetch: CustomFetch) {
  _fetch = fetch;
}
