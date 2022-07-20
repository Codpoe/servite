import { ComponentType } from 'react';
import { Components } from '@mdx-js/react/lib';
import type { Route } from 'virtual:conventional-routes';
import type { PageData } from 'virtual:conventional-pages-data';

export type { PageData };

export interface Theme {
  Layout: ComponentType<any>;
  NotFound?: ComponentType<any>;
  mdxComponents?: Components;
}

export interface AppState {
  theme: Theme;
  routes: Route[];
  pagesData: Record<string, PageData>;
  pagePath?: string;
  pageData?: PageData;
  pageModule?: any;
  pageLoading: boolean;
  pageError: Error | null;
}
