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
  color: #000;
  background: #fff;
}

.servite-error-h1 {
  border-right: 1px solid rgba(0, 0, 0, .3);
}

@media (prefers-color-scheme: dark) {
  body {
    color: #fff;
    background: #000;
  }

  .servite-error-h1 {
    border-right: 1px solid rgba(255, 255, 255, .3);
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
          alignItems: 'center',
        }}
      >
        <h1
          className="servite-error-h1"
          style={{
            margin: '0 20px 0 0',
            paddingRight: '23px',
            fontSize: '24px',
            fontWeight: '500',
            lineHeight: '49px',
          }}
        >
          {title}
        </h1>
        <div style={{ fontSize: '14px', lineHeight: '49px' }}>
          {error.message}
        </div>
      </div>
    </>
  );
};
