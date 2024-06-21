'use client';

import { ActiveSectionContextProvider } from './active-section-context';
import { NavbarContextProvider } from './navbar-provider';
import { ThemeProvider } from './theme-provider';

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
