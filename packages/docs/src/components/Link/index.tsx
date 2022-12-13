import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'servite/client';

export interface LinkProps extends Omit<RouterLinkProps, 'to' | 'color'> {
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
    <RouterLink {...restProps} className={finalClassName} to={to}>
      {finalChildren}
    </RouterLink>
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
