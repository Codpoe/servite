import { defer, LoaderFunction } from 'servite/runtime/router';
import getUser from '@/server/routes/user.get';

export interface LoaderData {
  a: number;
  b: string;
  c?: Promise<boolean>;
  getUserPromise: ReturnType<typeof getUser>;
}

export const loader: LoaderFunction = async () => {
  // throw new Error('loader error');
  // throw new Response('abc', {
  //   status: 404,
  //   statusText: 'Not Found',
  // });
  // const res = await getUser({});

  return defer({
    a: Date.now(),
    b: 'bbb',
    c: new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    }),
    getUserPromise: getUser({}),
  } satisfies LoaderData);
};
