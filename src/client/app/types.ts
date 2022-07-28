import type { Route } from 'virtual:servite/routes';
import type { Page as PageData } from 'virtual:servite/pages';

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
  pageData?: PageData;
  pageModule?: any;
  pageLoading: boolean;
  pageError: PageError | null;
}
