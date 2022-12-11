import { useState } from 'react';

export function CounterVisible({
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
      <div className="counter-message">visible</div>
      <div>children: {children}</div>
      <div className="counter">
        <button onClick={subtract}>-</button>
        <pre>{count}</pre>
        <button onClick={add}>+</button>
      </div>
      <style jsx>{`
        .counter-message {
          color: gray;
        }
        .counter {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}
