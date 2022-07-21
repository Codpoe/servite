import type { Route } from 'virtual:conventional-routes';
import type { PageData } from 'virtual:conventional-pages-data';

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
  pagesData: Record<string, PageData>;
  pagePath?: string;
  pageData?: PageData;
  pageModule?: any;
  pageLoading: boolean;
  pageError: PageError | null;
}
