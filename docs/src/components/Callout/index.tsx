import React from 'react';
import { Bolt, Info, AlertCircle, AlertTriangle } from '../Icons';

import './index.css';

export type CalloutType = 'tip' | 'info' | 'warning' | 'danger';

const typeToIconMap: Record<CalloutType, React.ComponentType<any>> = {
  tip: Bolt,
  info: Info,
  warning: AlertCircle,
  danger: AlertTriangle,
};

export interface CalloutProps {
  type: CalloutType;
  title?: React.ReactNode;
  icon?: React.ComponentType<any> | string;
  children?: React.ReactNode;
}

export function Callout({
  type,
  title = type.toUpperCase(),
  icon = typeToIconMap[type],
  children,
}: CalloutProps) {
  return (
    <div className={`callout callout-${type} relative my-5 p-4 rounded-lg`}>
      <div className="callout-bg absolute top-0 bottom-0 left-0 right-0 rounded-lg"></div>
      <div className="callout-header flex items-start space-x-2 text-base font-bold">
        <span className="flex items-center h-6">
          {typeof icon === 'string'
            ? icon
            : React.createElement(icon, { className: 'text-[1.2em]' })}
        </span>
        <div>{title}</div>
      </div>
      {children && (
        <div className="callout-content mt-1 ml-0.5">{children}</div>
      )}
    </div>
  );
}
