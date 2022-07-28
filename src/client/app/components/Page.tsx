import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { useAppState } from '../context';

export interface PageProps {
  fallback?: React.ReactNode;
}

/**
 * Render page content
 */
export const Page: React.FC<PageProps> = ({ fallback }) => {
  const { routes, pageData } = useAppState();
  const routesElement = useRoutes(routes);

  if (!pageData) {
    return null;
  }

  return <Suspense fallback={fallback}>{routesElement}</Suspense>;
};
