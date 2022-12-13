import { Link } from 'servite/client';
import { useSiteState } from '@/context';
import { SITE_TITLE } from '@/constants';
import { TextNav, IconNav } from '../Nav';
import { Search } from '../Search';
import { ThemeModeSwitch } from '../ThemeModeSwitch';
import { NavScreen } from '../NavScreen';

export function Header() {
  const { currentLocale } = useSiteState();

  return (
    <div className="sticky top-0 w-full z-[var(--z-index-header)]">
      <div className="h-[var(--banner-height)] px-6 bg-c-brand leading-[var(--banner-height)] text-center text-white text-xs font-semibold">
        This is early WIP!
      </div>
      <header className="h-[var(--header-height)] border-b border-b-c-border-1 bg-c-bg-0">
        <div className="h-full max-w-8xl mx-auto px-6 flex items-center">
          <Link
            className="h-full flex items-center space-x-2 hover:opacity-80 transition-opacity"
            to={currentLocale.localePath || ''}
          >
            <h1 className="text-lg font-medium tracking-wide text-c-text-0">
              {SITE_TITLE}
            </h1>
          </Link>
          <div className="h-full hidden md:block">
            <Search __island={'visible'} />
          </div>
          <div className="h-full ml-auto -mr-2 hidden md:flex items-center">
            <TextNav />
            <ThemeModeSwitch
              __island={'visible'}
              className="ml-4 pl-4 mr-2 border-l border-c-border-1"
            />
            <IconNav size="small" />
          </div>
          <div className="h-full ml-auto -mr-4 flex md:hidden items-center">
            <Search __island={'visible'} iconOnly />
            <NavScreen __island={'visible'} />
          </div>
        </div>
      </header>
    </div>
  );
}
