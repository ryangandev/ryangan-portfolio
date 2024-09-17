'use client';

import { ActiveSectionContextProvider } from '@/providers/active-section-context';
import { NavbarContextProvider } from '@/providers/navbar-provider';
import { ThemeProvider } from '@/providers/theme-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="rg-theme"
      disableTransitionOnChange
    >
      <ActiveSectionContextProvider>
        <NavbarContextProvider>{children}</NavbarContextProvider>
      </ActiveSectionContextProvider>
    </ThemeProvider>
  );
}
