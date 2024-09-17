import React from 'react';
import { getYear } from 'date-fns';

import { ThemeToggle } from '@/components/theme-toggle';

export default function SiteFooter() {
  return (
    <footer className="border-t px-6 text-sm">
      <div className="mx-auto flex h-12 w-full max-w-[644px] items-center justify-between text-muted-foreground/80">
        <span className="mr-2">Minimalist.</span>
        <div className="flex items-center space-x-4">
          <span className="text-nowrap">{getYear(new Date())} Ryan Gan.</span>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
