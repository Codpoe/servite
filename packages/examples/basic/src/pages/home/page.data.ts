import { defer, LoaderFunction } from 'servite/runtime/router';
import getUser from '@/server/routes/user.get';

export interface LoaderData {
  a: number;
  b: string;
  c?: Promise<boolean>;
  user: Awaited<ReturnType<typeof getUser>>;
  getUserPromise: ReturnType<typeof getUser>;
}

export const loader: LoaderFunction = async () => {
  'use server';
  const user = await getUser({});

  return defer({
    a: Date.now(),
    b: 'bbb',
    c: new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 300);
    }),
    user,
    getUserPromise: getUser({}),
  } satisfies LoaderData);
};
