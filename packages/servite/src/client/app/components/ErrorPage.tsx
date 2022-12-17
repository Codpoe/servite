import { PageError } from '../types';

export interface ErrorPageProps {
  error: PageError;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => {
  const title = error.isNotFound ? '404' : error.name;

  return (
    <>
      <style>{`
body {
  margin: 0;
  background: #fff;
}

.servite-error-h1 {
  color: rgb(229, 231, 235);
}

.servite-error-p {
  color: rgb(107, 114, 128);
}

@media (prefers-color-scheme: dark) {
  body {
    background: rgb(17, 24, 39);
  }

  .servite-error-h1 {
    color: rgb(55, 65, 81);
  }

  .servite-error-p {
    color: rgb(156, 163, 175);
  }
}
      `}</style>
      <div
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1
          className="servite-error-h1"
          style={{
            margin: 0,
            fontSize: '128px',
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {title}
        </h1>
        <p
          className="servite-error-p"
          style={{ marginTop: '16px', fontSize: '16px', lineHeight: 1.5 }}
        >
          {error.message}
        </p>
      </div>
    </>
  );
};
