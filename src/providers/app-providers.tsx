'use client';

import { ActiveSectionContextProvider } from './active-section-context';
import { NavbarContextProvider } from './navbar-provider';
import { ThemeProvider } from './theme-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ActiveSectionContextProvider>
        <NavbarContextProvider>{children}</NavbarContextProvider>
      </ActiveSectionContextProvider>
    </ThemeProvider>
  );
}
