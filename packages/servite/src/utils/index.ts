import { defu } from 'defu';

export function defaults<T extends Record<string, any>, K extends T>(
  origin: T | undefined,
  defaultValue: K,
): Omit<T, keyof K> &
  Required<Pick<T, keyof K extends keyof T ? keyof K : never>> {
  return defu(origin, defaultValue) as any;
}

export function createNotFoundResponse() {
  return new Response(
    `<center><h1>404 Not Found</h1></center><hr><center>Servite</center>`,
    {
      status: 404,
      headers: {
        'content-type': 'text/html',
      },
    },
  );
}
