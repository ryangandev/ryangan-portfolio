'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { navLinks } from '@/data/links';
import { cn } from '@/lib/utils';

export default function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn('', className)}>
      <ul className="flex items-center justify-center space-x-4">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'relative inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-sm font-medium text-foreground/60 transition-all hover:text-accent-foreground',
                pathname === link.href ? 'text-accent-foreground' : '',
              )}
            >
              {link.name}
              {pathname === link.href && (
                <motion.span
                  className="absolute inset-0 -z-10 rounded-md bg-gray-200 dark:bg-gray-700"
                  layoutId="activeSection" // when multiple components witht the same 'layoutId', framer motion will animation between them when their position or size changes
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
