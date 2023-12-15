import type { StaticHandlerContext } from 'react-router-dom/server';

export function sanitizeError<T = unknown>(error: T) {
  if (error instanceof Error && process.env.NODE_ENV !== 'development') {
    const sanitized = new Error('Unexpected Server Error');
    sanitized.stack = undefined;
    return sanitized;
  }

  return error;
}

export function sanitizeErrors(errors: StaticHandlerContext['errors']) {
  return Object.entries(errors || {}).reduce(
    (acc, [routeId, error]) => {
      return Object.assign(acc, {
        [routeId]: sanitizeError(error),
      });
    },
    {} as Record<string, any>
  );
}

export interface SerializedError {
  message: string;
  stack?: string;
}

export function serializeError(error: Error): SerializedError {
  const sanitized = sanitizeError(error);

  return {
    message: sanitized.message,
    stack: sanitized.stack,
  };
}
