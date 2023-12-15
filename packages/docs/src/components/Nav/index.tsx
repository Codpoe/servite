import React from 'react';
import { useSite } from '@/context';
import { useActiveMatch } from '@/hooks/useActiveMatch';
import { NavItem } from '@/types';
import { Link } from '../Link';
import { ChevronDown } from '../Icons';
import { Popup } from '../Popup';
import { TextWithIcon } from '../TextWithIcon';

function SubTextNavItem({ item }: { item: NavItem }) {
  const active = useActiveMatch(item);

  return (
    <Link
      to={item.link}
      color={false}
      className={`relative z-0 flex items-center min-h-[32px] px-2 py-1.5 whitespace-nowrap transition-all
        before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 before:rounded before:bg-current before:z-[-1] before:transition-opacity
        ${
          active
            ? 'text-c-brand font-medium before:opacity-[0.12]'
            : 'before:opacity-0 hover:before:opacity-[0.06]'
        }
      `}
    >
      <TextWithIcon text={item.text} icon={item.icon} space="8px" />
    </Link>
  );
}

function TextNavItem({ item }: { item: NavItem }) {
  const active = useActiveMatch(item);

  const className = `h-full flex items-center px-3 border-b
    cursor-pointer font-medium transition-colors
    `;

  if (item.items?.length) {
    return (
      <div
        className={`${className} border-transparent group-hover:text-c-brand`}
      >
        <TextWithIcon text={item.text} icon={item.icon} space="6px" />
        <ChevronDown className="ml-1" />
      </div>
    );
  }

  return (
    <Link
      to={item.link}
      color={false}
      className={`${className} hover:text-c-brand
        ${active ? 'border-c-brand' : 'border-transparent'}
      `}
    >
      <TextWithIcon text={item.text} icon={item.icon} space="6px" />
    </Link>
  );
}

export function TextNav() {
  const { textNav } = useSite();

  if (!textNav?.length) {
    return null;
  }

  return (
    <nav className="h-full hidden md:flex items-center text-sm text-c-text-0 -mb-0.5">
      {textNav.map((item, index) =>
        item.items ? (
          <Popup
            key={index}
            className="h-full"
            content={
              <div className="px-1 space-y-[3px]">
                {item.items.map((subItem, index) => (
                  <SubTextNavItem key={index} item={subItem} />
                ))}
              </div>
            }
          >
            <TextNavItem item={item} />
          </Popup>
        ) : (
          <TextNavItem key={index} item={item} />
        )
      )}
    </nav>
  );
}

export function IconNav({
  size,
  className,
}: {
  size: 'small' | 'medium';
  className?: string;
}) {
  const { iconNav } = useSite();

  if (!iconNav?.length) {
    return null;
  }

  return (
    <div className={`${className} flex justify-start items-center flex-wrap`}>
      {iconNav.map(
        (item, index) =>
          item.icon && (
            <Link
              key={index}
              to={item.link}
              color={false}
              className={`flex justify-center items-center text-c-text-2 transition-colors hover:text-c-brand
              ${size === 'small' ? 'w-9 h-9 text-[17px]' : ''}
              ${size === 'medium' ? 'w-12 h-12 text-xl' : ''}`}
            >
              {React.createElement(item.icon)}
            </Link>
          )
      )}
    </div>
  );
}
