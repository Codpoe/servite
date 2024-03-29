import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';

export function ErrorBoundary() {
  const error: any = useRouteError();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <>
      <style>{`
.servite-error-boundary {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.servite-error-title {
  margin: 0;
  font-size: 56px;
  line-height: 64px;
  font-weight: 600;
  color: #374151;
}

.servite-error-desc {
  margin: 0;
  padding-top: 28px;
  letter-spacing: 1px;
  font-size: 20px;
  line-height: 20px;
  font-weight: 700;
  color: #374151;
}

.servite-error-divider {
  margin: 24px auto 18px;
  width: 64px;
  height: 1px;
  background-color: #d1d5db;
}

.servite-error-msg {
  margin: 0 auto;
  max-width: 600px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: #6b7280;
}

@media (prefers-color-scheme: dark) {
  .servite-error-boundary {
    background: #1b1b1f;
  }

  .servite-error-title {
    color: #e5e7eb;
  }

  .servite-error-desc {
    color: #e5e7eb;
  }

  .servite-error-divider {
    background-color: #6b7280;
  }

  .servite-error-msg {
    color: #9ca3af;
  }
}
      `}</style>
      <div className="servite-error-boundary">
        <h1 className="servite-error-title">{error.status || 'Oops!'}</h1>
        <p className="servite-error-desc">
          {error.statusText || 'Sorry, an unexpected error has occurred.'}
        </p>
        <div className="servite-error-divider"></div>
        <p className="servite-error-msg">{error.data || error.message}</p>
      </div>
    </>
  );
}
