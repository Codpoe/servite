import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import './index.css';

export interface PopupProps {
  content: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function Popup({ className = '', content, children }: PopupProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    if (!elRef.current) {
      return;
    }

    function enterCallback() {
      setIsHover(true);
    }

    function leaveCallback() {
      setIsHover(false);
    }

    const el = elRef.current;

    el.addEventListener('mouseenter', enterCallback);
    el.addEventListener('mouseleave', leaveCallback);

    return () => {
      el.removeEventListener('mouseenter', enterCallback);
      el.removeEventListener('mouseleave', leaveCallback);
    };
  }, []);

  return (
    <div className={`${className} group relative inline-block`} ref={elRef}>
      {children}
      <CSSTransition
        classNames="anim-popup"
        in={isHover}
        timeout={200}
        mountOnEnter
        unmountOnExit
      >
        <div className="origin-top-right absolute top-3/4 right-0 w-max min-w-[100px] bg-c-bg-0 py-1 overflow-y-auto rounded-md border border-c-border-1 border-opacity-5 shadow-md">
          {content}
        </div>
      </CSSTransition>
    </div>
  );
}
