import { Await, useLoaderData } from 'servite/runtime/router';
import { Suspense, useState } from 'react';
import type { LoaderData } from './page.data';

export default function Home() {
  const loaderData = useLoaderData() as LoaderData;
  const [count, setCount] = useState(0);

  return (
    <div>
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
    </div>
  );
}
