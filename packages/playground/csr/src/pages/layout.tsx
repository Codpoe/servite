import { Outlet } from 'servite/client';
import './layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <Outlet />
    </div>
  );
}
