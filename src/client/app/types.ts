import type { Page as PageData, AppState } from '../../shared/types.js';

export type { PageData, AppState };

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

export type LoaderFunction<
  T extends Record<string, any> | undefined | null | void
> = () => T | Promise<T>;
