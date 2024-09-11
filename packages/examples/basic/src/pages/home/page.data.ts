import { defer, LoaderFunction } from 'servite/runtime/router';

export interface LoaderData {
  a: number;
  b: string;
  c?: Promise<boolean>;
}

export const loader: LoaderFunction = async () => {
  // throw new Error('loader error');
  // throw new Response('abc', {
  //   status: 404,
  //   statusText: 'Not Found',
  // });

  return defer({
    a: Date.now(),
    b: 'bbb',
    c: new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    }),
  } satisfies LoaderData);
};
