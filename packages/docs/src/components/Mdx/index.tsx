import React from 'react';
import { Link } from 'servite/runtime/router';
import { MDXProvider } from 'servite/runtime/mdx';
import { Callout } from '../Callout';
import 'servite/runtime/mdx.css';

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

export interface MdxProps {
  children?: React.ReactNode;
}

export function Mdx({ children }: MdxProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <MDXProvider components={{ Callout, a: A }}>{children}</MDXProvider>
    </div>
  );
}

export default Mdx;
