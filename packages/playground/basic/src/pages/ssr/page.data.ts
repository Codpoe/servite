import { json } from 'servite/client';

export function loader() {
  return json(
    {
      ssr: 'ok',
    },
    {
      headers: {
        'x-custom-header': 'yes',
      },
    }
  );
}
