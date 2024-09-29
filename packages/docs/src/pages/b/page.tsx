import { Link, useLoaderData } from 'servite/runtime/router';

export default function Page() {
  const loaderData = useLoaderData();
  return (
    <div>
      <div>B Page</div>
      <div>{JSON.stringify(loaderData)}</div>
      <Link to="/a">To A Page</Link>
    </div>
  );
}
