import { Link } from 'servite/runtime/router';
import { SidebarItemWrapperProps } from 'shadcn-react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SidebarLinkProps extends SidebarItemWrapperProps {}

export function SidebarLink({ value, children }: SidebarLinkProps) {
  return (
    <Link className="block" to={value}>
      {children}
    </Link>
  );
}
