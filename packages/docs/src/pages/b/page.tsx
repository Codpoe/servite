import { useId } from 'react';
import { Link, useLoaderData } from 'servite/runtime/router';

export default function Page() {
  const loaderData = useLoaderData();
  const id = useId();
  return (
    <div id={id}>
      <div>B Page</div>
      <div>{JSON.stringify(loaderData)}</div>
      <Link to="/a">To A Page</Link>
    </div>
  );
}
