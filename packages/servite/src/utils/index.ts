import { defu } from 'defu';

export function defaults<T extends Record<string, any>, K extends T>(
  origin: T | undefined,
  defaultValue: K,
): Omit<T, keyof K> &
  Required<Pick<T, keyof K extends keyof T ? keyof K : never>> {
  return defu(origin, defaultValue) as any;
}

export function createErrorResponse(
  statusCode: number,
  statusText: string,
  error?: any,
) {
  return new Response(
    `<center><h1>${statusCode}</h1><h2>${statusText}</h2></center><hr><center><div>${(import.meta.env.DEV && error?.stack) || 'Servite'}</div></center>`,
    {
      status: statusCode,
      headers: {
        'content-type': 'text/html',
      },
    },
  );
}
