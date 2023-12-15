/**
 * @title 1234
 */
import { useState } from 'react';
import { Link, useLoaderData, useMatches } from 'servite/client';
import reactLogo from '../assets/react.svg';
import type { LoaderData } from './page.data';
import './page.css';

export const toc = [{}, 2, 3, 4];

export default function Page() {
  const loaderData = useLoaderData() as LoaderData;
  const [count, setCount] = useState(0);
  const routeMatches = useMatches();
  const m = routeMatches[routeMatches.length - 1];

  return (
    <div className="App">
      <pre>loaderData: {JSON.stringify(loaderData)}</pre>
      <pre>handle: {JSON.stringify(m.handle as any)}</pre>
      <button onClick={() => setCount(count + 1)}>count is {count}</button>
      <div>
        <Link to="/ssr">ssr</Link>
        {'  '}
        <Link to="/csr">csr</Link>
        {'  '}
        <Link to="/islands">islands</Link>
      </div>
      <div>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>
          Edit <code>src/pages/page.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}
