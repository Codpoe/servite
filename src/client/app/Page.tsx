import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { useAppState } from './context';

export interface PageProps {
  fallback?: React.ReactNode;
}

/**
 * Render page content
 */
export const Page: React.FC<PageProps> = ({ fallback }) => {
  const { routes, pagePath } = useAppState();
  const routesElement = useRoutes(routes);

  if (!pagePath) {
    return null;
  }

  return <Suspense fallback={fallback}>{routesElement}</Suspense>;
};
