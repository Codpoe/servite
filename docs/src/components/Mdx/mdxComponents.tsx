import { Link } from '../Link';

export function A(props: { href?: string }) {
  const { href, ...restProps } = props;
  return <Link {...restProps} to={href} />;
}

export function Table(props: any) {
  return (
    <div className="sv-table-wrapper">
      <table {...props} />
    </div>
  );
}

// export function Pre({
//   children,
//   className,
//   style,
// }: {
//   children: string;
//   className: string;
//   style: React.CSSProperties;
// }) {
//   return (
//     <pre className={className} style={style}>
//       {children}
//     </pre>
//   );
// }
