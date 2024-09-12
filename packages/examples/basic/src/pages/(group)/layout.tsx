import { Outlet } from 'servite/runtime/router';

export default function Layout() {
  return (
    <div>
      Group Layout
      <div>
        <Outlet />
      </div>
    </div>
  );
}
