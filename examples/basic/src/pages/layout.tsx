import { Outlet } from 'react-router-dom';
import './layout.css';

export default function Layout() {
  return (
    <div>
      <span className="layout">Layout</span>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
