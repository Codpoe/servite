import { useState } from 'react';
import './Counter.css';

declare module 'react' {
  interface Attributes {
    __island?: 'load' | 'idle' | 'visible' | 'media';
  }
}

export function Counter({
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
      <div className="counter">
        <button onClick={subtract}>-</button>
        <pre>{count}</pre>
        <button onClick={add}>+</button>
      </div>
      <div className="counter-message">{children}</div>
    </div>
  );
}
