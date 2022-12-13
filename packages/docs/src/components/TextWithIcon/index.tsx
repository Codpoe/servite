import React from 'react';

type Icon =
  | string
  | React.ComponentType<any>
  | [type: string | React.ComponentType<any>, props?: Record<string, any>];

export function TextWithIcon({
  text,
  icon,
  space,
  as = React.Fragment,
  className,
}: {
  text?: string;
  icon?: Icon;
  space?: number | string;
  as?: keyof React.ReactHTML | React.ComponentType<any>;
  className?: string;
}) {
  const iconType = Array.isArray(icon) ? icon[0] : icon;
  const iconProps = Array.isArray(icon) ? icon[1] : undefined;

  return React.createElement(
    as,
    className && { className },
    <>
      {iconType &&
        React.createElement(iconType, {
          ...iconProps,
          ...(space != null && {
            style: { marginRight: space, ...iconProps?.style },
          }),
        })}
      <span>{text}</span>
    </>
  );
}
