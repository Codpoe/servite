/**
 * @title 1234
 */
import { useState } from 'react';
import { useLoaderData } from 'servite/client';
import reactLogo from '../assets/react.svg';
import { Counter } from '../components/Counter';
import './page.css';

interface LoaderData {
  list: number[];
  total: number;
}

export const loader = () => {
  return {
    list: [0, 1, 2],
    total: 8,
  };
};

function Page() {
  const [count, setCount] = useState(0);
  const loaderData = useLoaderData<LoaderData>();

  return (
    <div className="App">
      <pre>loaderData: {JSON.stringify(loaderData)}</pre>
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
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <Counter __island={'load'} initialCount={2}>
        Hello World
      </Counter>
    </div>
  );
}

export default Page;
