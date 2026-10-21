import React from 'react';
import { getYear } from 'date-fns';

import Logo from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

export default function SiteFooter() {
  return (
    <footer className="border-t px-6 text-sm">
      <div
        data-footer-column
        className="relative mx-auto flex h-12 w-full max-w-[644px] items-center justify-between text-muted-foreground/80"
      >
        {/* No tagline: the home page's is the site's one line, and leaving
            this one out keeps the year in the row on a phone too. */}
        <span className="mr-2 flex items-center gap-2.5">
          <Logo variant="tile" size={16} className="shrink-0" />
          <span className="whitespace-nowrap">
            © {getYear(new Date())} Ryan Gan.
          </span>
        </span>
        <ThemeToggle />
      </div>
    </footer>
  );
}
