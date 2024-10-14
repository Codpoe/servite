import { Await, useLoaderData } from 'servite/runtime/router';
import { Suspense, useEffect, useId, useState } from 'react';
import { Helmet } from 'servite/runtime/helmet';
import type { LoaderData } from './page.data';
import { serverFn_1, serverFn_2 } from './server-fns';
import getUser from '@/server/routes/user.get';

export default function Home() {
  const id = useId();
  const loaderData = useLoaderData() as LoaderData;
  const [count, setCount] = useState(0);

  const [user, setUser] = useState<Awaited<LoaderData['getUserPromise']>>();
  const [rawUserResponse, setRawUserReponse] = useState<Response | undefined>();
  const [serverFn_1_res, setServerFn_1_res] =
    useState<Awaited<ReturnType<typeof serverFn_1>>>();
  const [serverFn_2_res, setServerFn_2_res] =
    useState<Awaited<ReturnType<typeof serverFn_2>>>();

  useEffect(() => {
    getUser({}).then(setUser);
    getUser.raw({}).then(setRawUserReponse);
    serverFn_1().then(setServerFn_1_res);
    serverFn_2().then(setServerFn_2_res);
  }, []);

  return (
    <>
      <Helmet>
        <meta name="description" content="testtt" />
      </Helmet>
      <div id={id} className="text-blue-500">
        Home
        <div>{JSON.stringify(loaderData)}</div>
        <button onClick={() => setCount(count + 1)}>{count}</button>
        <Suspense fallback={<div>loading c</div>}>
          <Await resolve={loaderData.c}>
            {(c: boolean) => {
              return <div>{JSON.stringify(c)}</div>;
            }}
          </Await>
        </Suspense>
        <Suspense fallback={<div>loading getUser</div>}>
          <Await resolve={loaderData.getUserPromise}>
            {(user: Awaited<LoaderData['getUserPromise']>) => {
              return <div>{JSON.stringify(user)}</div>;
            }}
          </Await>
        </Suspense>
        <div className="text-red-500">
          client user: {JSON.stringify(user || null)}
        </div>
        <div className="text-red-500">
          client raw user response:{' '}
          {JSON.stringify({
            ok: rawUserResponse?.ok,
            status: rawUserResponse?.status,
            statusText: rawUserResponse?.statusText,
            'content-type': rawUserResponse?.headers.get('content-type'),
          })}
        </div>
        <div>serverFn_1: {JSON.stringify(serverFn_1_res || null)}</div>
        <div>serverFn_2: {JSON.stringify(serverFn_2_res || null)}</div>
      </div>
    </>
  );
}
