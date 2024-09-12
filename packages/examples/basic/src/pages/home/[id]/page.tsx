import { useParams } from 'servite/runtime/router';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <div>id: {id}</div>;
}
