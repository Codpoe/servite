import type { Page as PageData, Route } from '../../shared/types.js';

export type { PageData };

export class PageError extends Error {
  isNotFound?: boolean;

  constructor(
    message?: string,
    options?: {
      cause?: Error;
      isNotFound?: boolean;
    }
  ) {
    super(message, options?.cause ? { cause: options.cause } : undefined);
    this.isNotFound = options?.isNotFound;
  }
}

export interface AppState {
  routes: Route[];
  pages: PageData[];
  pagePath?: string;
  pageData?: PageData;
  pageModule?: any;
  pageLoading: boolean;
  pageError: PageError | null;
  loaderData?: LoaderResult;
}

export type LoaderResult = Record<string, any> | null | void;

export type LoaderFunction<T extends LoaderResult = LoaderResult> = () =>
  | T
  | Promise<T>;
