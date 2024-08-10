'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { navLinks } from '@/data/links';
import { checkPathnameActive, cn } from '@/lib/utils';

type MainNavProps = {
  className?: string;
};

type NavLinkProps = {
  name: string;
  href: string;
  isActive: boolean;
};

const MainNav: React.FC<MainNavProps> = ({ className }) => {
  const pathname = usePathname();

  return (
    <nav className={cn('', className)}>
      <ul className="flex items-center justify-center space-x-5">
        {navLinks.map((link) => (
          <li key={link.href}>
            <NavLink
              href={link.href}
              name={link.name}
              isActive={checkPathnameActive(link.href, pathname)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

const NavLink: React.FC<NavLinkProps> = ({ href, name, isActive }) => {
  return (
    <Link
      href={href}
      className={cn(
        'relative inline-flex items-center justify-center py-0.5 text-sm font-medium text-foreground/60 transition-all hover:text-accent-foreground',
        isActive ? 'text-accent-foreground' : '',
      )}
    >
      {name}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 h-0.5 bg-accent-foreground',
          isActive ? 'w-full' : 'w-0',
        )}
        style={{
          transition: 'width 300ms ease',
        }}
        role="none"
        aria-hidden={true}
      />
    </Link>
  );
};

export default MainNav;
