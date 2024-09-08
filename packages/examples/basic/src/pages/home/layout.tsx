import { Helmet } from 'servite/runtime/helmet';
import { Outlet } from 'servite/runtime/router';

export default function Layout() {
  return (
    <div>
      <Helmet>
        <title>Servite</title>
      </Helmet>
      Home Layout
      <Outlet />
    </div>
  );
}
