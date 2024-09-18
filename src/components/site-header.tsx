import MainNav from '@/components/navigation/main-nav';
import MobileMainNav from '@/components/navigation/mobile-main-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

export default function SiteHeader() {
  return (
    <header
      className={cn(
        'sticky top-0 z-[999] h-16 w-full bg-background px-4 py-3 shadow-sm',
        'border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      )}
    >
      <div className="mx-auto flex max-w-[644px] items-center justify-between">
        <MainNav className="hidden sm:block" />
        <MobileMainNav className="sm:hidden" />
        <ThemeToggle />
      </div>
    </header>
  );
}
