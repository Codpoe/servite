/**
 * @title 1234
 */
import { useLoaderData } from 'servite/client';
import reactLogo from '../assets/react.svg';

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
  const loaderData = useLoaderData() as LoaderData;

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
        <p>
          Edit <code>src/pages/page.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <style jsx>{`
        .logo {
          height: 6em;
          padding: 1.5em;
          will-change: filter;
        }
        .logo:hover {
          filter: drop-shadow(0 0 2em #646cffaa);
        }
        .logo.react:hover {
          filter: drop-shadow(0 0 2em #61dafbaa);
        }

        @keyframes logo-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          a:nth-of-type(2) .logo {
            animation: logo-spin infinite 20s linear;
          }
        }

        .card {
          padding: 2em;
        }

        .read-the-docs {
          color: #888;
        }
      `}</style>
    </div>
  );
}
