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
        <span className="mr-2 flex items-center gap-2.5">
          <Logo variant="tile" size={16} className="shrink-0" />
          <span className="whitespace-nowrap">Embrace Minimalism.</span>
        </span>
        <div className="flex items-center space-x-4">
          {/* The name gives way on a phone, where with the theme toggle it
              left the tagline too little room and wrapped it. */}
          <span className="text-nowrap">
            {getYear(new Date())}
            <span className="hidden sm:inline"> Ryan Gan.</span>
          </span>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
