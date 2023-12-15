import { PrefetchLink, PrefetchLinkProps } from 'servite/client';

export interface LinkProps extends Omit<PrefetchLinkProps, 'to' | 'color'> {
  to?: string;
  color?: boolean;
}

export function Link(props: LinkProps) {
  const {
    to = '',
    children,
    className = '',
    color = true,
    ...restProps
  } = props;
  const isSameOrigin = !to.startsWith('http');
  const isHash = to.startsWith('#');

  const finalClassName = `${className} ${
    color ? 'text-c-brand hover:text-c-brand-light transition-colors' : ''
  }`;

  const finalChildren = <>{children}</>;

  return isSameOrigin && !isHash ? (
    <PrefetchLink {...restProps} className={finalClassName} to={to}>
      {finalChildren}
    </PrefetchLink>
  ) : (
    <a
      {...restProps}
      className={finalClassName}
      href={to}
      {...(!isHash && {
        target: '_blank',
      })}
    >
      {children}
    </a>
  );
}
