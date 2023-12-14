import React from 'react';
import type { DocSearchProps } from '@docsearch/react';
import type { RouteHandle } from 'servite/client';

export type ThemeMode = 'light' | 'dark';

export interface LocaleConfig {
  locale: string;
  localeText: string;
  localePath: string;
}

export interface NavItem {
  text?: string;
  icon?: React.ComponentType<any>;
  link?: string;
  items?: NavItem[];
  locale?: string;
  activeMatch?: string;
}

export interface SidebarItem {
  text: string;
  icon?: React.ComponentType<any>;
  link?: string;
  items?: SidebarItem[];
}

export interface DocsRepoInfo {
  repo: string;
  branch?: string;
  dir?: string;
}

export interface SiteContextValue {
  currentLocale: LocaleConfig;
  textNav: NavItem[];
  iconNav: NavItem[];
  sidebar: SidebarItem[];
  routeHandle?: RouteHandle;
  /**
   * The frontmatter of markdown
   */
  frontmatter?: Record<string, any>;
}

export type HtmlTagConfig =
  | [string, Record<string, any>]
  | [string, Record<string, any>, string];

export interface ThemeConfig {
  [key: string]: any;
  locale?: string;
  localeText?: string;
  logo?: string;
  title?: string;
  description?: string;
  nav?: NavItem[];
  sidebar?: SidebarItem[] | Record<string, SidebarItem[]>;
  docsRepo?: string;
  docsDir?: string;
  docsBranch?: string;
  editLink?: boolean | string;
  lastUpdated?: boolean | string;
  algolia?: DocSearchProps;
  themeConfigByPaths?: Record<string, ThemeConfig>;
}
