import { Await, useLoaderData } from 'servite/runtime/router';
import { Suspense, useMemo, useState } from 'react';
import type { LoaderData } from './page.data';
import { serverFn_1, serverFn_2 } from './server-fns';

// const serverFn_1_promise = serverFn_1();

export default function Home() {
  const loaderData = useLoaderData() as LoaderData;
  const [count, setCount] = useState(0);
  const serverFn_1_promise = useMemo(() => serverFn_1(), []);
  const serverFn_2_promise = useMemo(() => serverFn_2(), []);

  return (
    <div className="text-blue-500">
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
      <Suspense fallback={<div>loading serverFn_1</div>}>
        <Await resolve={serverFn_1_promise}>
          {data => {
            return <div>serverFn_1: {JSON.stringify(data)}</div>;
          }}
        </Await>
      </Suspense>
      <Suspense fallback={<div>loading serverFn_2</div>}>
        <Await resolve={serverFn_2_promise}>
          {data => {
            return <div>serverFn_2: {JSON.stringify(data)}</div>;
          }}
        </Await>
      </Suspense>
    </div>
  );
}
