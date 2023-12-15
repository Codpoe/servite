import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import type { Components } from '@mdx-js/react/lib';
import { Callout } from '../Callout';
import { Demo } from '../Demo';
import * as _mdxComponents from './mdxComponents';
import './index.css';

const mdxComponents = Object.entries(_mdxComponents).reduce(
  (res, [name, component]) => {
    res[`${name[0].toLowerCase()}${name.slice(1)}`] = component;
    return res;
  },
  {
    Callout,
    Demo,
  } as Components
);

export interface MdxProps {
  className?: string;
  children: React.ReactNode;
}

export function Mdx({ className = '', children }: MdxProps) {
  return (
    <div
      className={`${className} markdown-body prose dark:prose-invert max-w-none w-full
        prose-h2:pt-[1.25em] prose-h2:border-t prose-h2:border-[color:var(--tw-prose-hr)]
        prose-a:no-underline prose-a:text-c-brand hover:prose-a:text-c-brand-light prose-a:transition-colors
         prose-pre:bg-[rgba(0,0,0,0.03)] dark:prose-pre:bg-[rgba(0,0,0,0.3)] prose-pre:p-0
      `}
    >
      <MDXProvider components={mdxComponents}>{children}</MDXProvider>
    </div>
  );
}
