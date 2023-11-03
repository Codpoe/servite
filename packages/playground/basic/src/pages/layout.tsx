import './layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="layout">{children}</div>;
}
