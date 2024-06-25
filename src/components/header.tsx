import NameLogo from '@/components/name-logo';
import MainNav from '@/components/navs/main-nav';
import MobileMainNav from '@/components/navs/mobile-main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/libs/utils';

export default function Header() {
  return (
    <header
      className={cn(
        'fixed z-[999] h-16 w-full bg-background px-4 py-3 shadow-sm',
        'border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      )}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <NameLogo className="hidden lg:block" content="Rg" />
        <MainNav className="hidden sm:block" />
        <MobileMainNav className="sm:hidden" />
        <ThemeToggle />
      </div>
    </header>
  );
}
