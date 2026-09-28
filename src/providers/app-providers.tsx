'use client';

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
      {children}
    </ThemeProvider>
  );
}
