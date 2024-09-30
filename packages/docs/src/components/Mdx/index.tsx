import React from 'react';
import { Link } from 'servite/runtime/router';
import { MDXProvider } from 'servite/runtime/mdx';
import { Callout } from '../Callout';
import 'servite/runtime/mdx.css';
import './index.css';

function A({
  href,
  ...restProps
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) {
  if (href?.startsWith('/')) {
    return <Link {...restProps} to={href || ''} />;
  }
  return <a href={href} target="_blank" rel="noreferrer" {...restProps} />;
}

function Table(
  props: React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  >,
) {
  return (
    <div className="my-[2em] overflow-x-auto">
      <table {...props} />
    </div>
  );
}

export interface MdxProps {
  children?: React.ReactNode;
}

export function Mdx({ children }: MdxProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <MDXProvider components={{ Callout, a: A, table: Table }}>
        {children}
      </MDXProvider>
    </div>
  );
}
