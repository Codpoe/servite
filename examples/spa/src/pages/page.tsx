/**
 * @title 1234
 */
import { useLoaderData } from 'servite/client';
import reactLogo from '../assets/react.svg';
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

export default function Page() {
  const loaderData = useLoaderData<LoaderData>();

  return (
    <div className="App">
      <h1>SPA</h1>
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
