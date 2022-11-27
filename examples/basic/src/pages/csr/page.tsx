import { ClientOnly } from 'servite/client';
import './page.css';

export default function Page() {
  return (
    <ClientOnly>
      <div className="csr">CSR: Client Side Render</div>
    </ClientOnly>
  );
}
