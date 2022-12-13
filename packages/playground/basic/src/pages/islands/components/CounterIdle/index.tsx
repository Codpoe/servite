import { useState } from 'react';
import reactLogo from '../../../../assets/react.svg';
import './index.css';

export function CounterIdle({
  children,
  initialCount = 0,
}: {
  children?: React.ReactNode;
  initialCount?: number;
}) {
  const [count, setCount] = useState(initialCount);
  const add = () => setCount(i => i + 1);
  const subtract = () => setCount(i => i - 1);

  return (
    <div>
      <div className="counter-message">idle</div>
      <div>children: {children}</div>
      <div>asset: {reactLogo}</div>
      <div className="counter">
        <button onClick={subtract}>-</button>
        <pre>{count}</pre>
        <button onClick={add}>+</button>
      </div>
    </div>
  );
}
