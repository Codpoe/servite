import { createContext, useContext, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useAppState } from 'servite/client';
import { NavItem as INavItem } from '@/types';
import { useSiteState } from '@/context';
import { useActiveMatch } from '@/hooks/useActiveMatch';
import { ChevronRight } from '../Icons';
import { Link } from '../Link';
import { ThemeModeSwitch } from '../ThemeModeSwitch';
import { IconNav } from '../Nav';
import { TextWithIcon } from '../TextWithIcon';

import './index.css';

const navScreenContext = createContext<{
  screenOpen: boolean;
  toggleScreen: () => void;
}>(null!);

const useNavScreenContext = () => useContext(navScreenContext);

function Hamburger() {
  const { screenOpen, toggleScreen } = useNavScreenContext();

  const className =
    'w-full h-0.5 bg-c-text-0 rounded-full absolute left-0 transition-all';

  return (
    <button
      className="group w-12 h-full inline-flex justify-center items-center"
      onClick={toggleScreen}
    >
      <div className="relative w-4 h-3.5 overflow-hidden">
        <div
          className={`${className} top-0
            ${
              screenOpen
                ? 'translate-y-1.5 -rotate-45'
                : 'group-hover:translate-x-1'
            }
          `}
        />
        <div
          className={`${className} top-1.5 translate-x-2
            ${
              screenOpen ? 'opacity-0' : 'opacity-100 group-hover:translate-x-0'
            }
          `}
        />
        <div
          className={`${className} bottom-0 translate-x-1 ${
            screenOpen
              ? 'translate-x-0 -translate-y-1.5 rotate-45'
              : 'group-hover:translate-x-2'
          }`}
        />
      </div>
    </button>
  );
}

function NavItem({ item }: { item: INavItem }) {
  const { toggleScreen } = useNavScreenContext();
  const [expanded, setExpanded] = useState(false);
  const active = useActiveMatch(item);

  const hasItems = Boolean(item.items?.length);

  const content = (
    <div className="flex justify-between items-center h-12 cursor-pointer">
      <span
        className={`flex items-center font-medium
          ${active ? 'text-c-brand' : 'text-c-text-0'}
        `}
      >
        <TextWithIcon text={item.text} icon={item.icon} space="8px" />
      </span>
      {hasItems && (
        <ChevronRight
          className={`text-c-text-2 transition-transform ${
            expanded ? 'rotate-90' : ''
          }`}
        />
      )}
    </div>
  );

  return (
    <div className="border-b border-c-border-1 text-sm">
      {hasItems ? (
        <div onClick={() => setExpanded(prev => !prev)}>{content}</div>
      ) : (
        <Link to={item.link} onClick={toggleScreen}>
          {content}
        </Link>
      )}
      {hasItems && expanded && (
        <div className="mb-2 py-2 rounded-lg bg-c-bg-1">
          {item.items?.map((subItem, index) => (
            <SubNavItem key={index} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
}

function SubNavItem({ item }: { item: INavItem }) {
  const { toggleScreen } = useNavScreenContext();
  const active = useActiveMatch(item);

  return (
    <Link
      className={`flex items-center h-8 px-4 ${
        active ? 'text-c-brand' : 'text-c-text-0'
      }`}
      to={item.link}
      color={false}
      onClick={toggleScreen}
    >
      <TextWithIcon text={item.text} icon={item.icon} space="8px" />
    </Link>
  );
}

export function NavScreen() {
  const { textNav } = useSiteState();
  const { pagePath } = useAppState();
  const [open, setOpen] = useState(false);

  const toggleScreen = () => {
    setOpen(prev => !prev);
  };

  // close nav-screen when path is changed
  useEffect(() => {
    setOpen(false);
  }, [pagePath]);

  return (
    <navScreenContext.Provider value={{ screenOpen: open, toggleScreen }}>
      <Hamburger />
      <CSSTransition
        classNames="nav-screen-anim"
        in={open}
        timeout={300}
        mountOnEnter
        unmountOnExit
      >
        <div className="fixed z-[var(--z-index-nav-screen)] top-[calc(var(--header-height)+var(--banner-height))] bottom-0 left-0 right-0 w-full px-8 py-6 bg-c-bg-0 overflow-y-auto">
          <div className="nav-screen-container max-w-[288px] mx-auto">
            {textNav.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
            <ThemeModeSwitch
              className="mt-6 px-4 py-3 rounded-lg bg-c-bg-1"
              showLabel
            />
            <IconNav className="mt-2 flex justify-center" size="medium" />
          </div>
        </div>
      </CSSTransition>
    </navScreenContext.Provider>
  );
}
