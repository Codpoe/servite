import { Outlet } from 'react-router-dom';
import './layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <Outlet />
    </div>
  );
}
