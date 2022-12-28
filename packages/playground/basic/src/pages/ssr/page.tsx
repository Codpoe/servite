import { useEffect, useState } from 'react';
import getA, { Bar, Result } from '../../server/api/a';
import styles from './page.module.css';

export default function Page() {
  const [apiResult, setApiResult] = useState<Result>();

  useEffect(() => {
    (async () => {
      const res = await getA({ foo: 'qwe', bar: Bar.Great });
      setApiResult(res);
    })();
  }, []);

  return (
    <div className={styles.ssr}>
      SSR: Server Side Render
      <pre className={styles['api-result']}>
        {JSON.stringify(apiResult, null, 2)}
      </pre>
    </div>
  );
}
