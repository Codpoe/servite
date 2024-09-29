import { Link, useLoaderData } from 'servite/runtime/router';

export default function Page() {
  const loaderData = useLoaderData();
  return (
    <div>
      <div>A Page</div>
      <div>{JSON.stringify(loaderData)}</div>
      <Link to="/b">To B Page</Link>
    </div>
  );
}
