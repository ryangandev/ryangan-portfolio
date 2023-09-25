'use client';

import { ThemeContextProvider } from './theme-provider';
import { ActiveSectionContextProvider } from './active-section-context';
import { NextUiProvider } from './nextui-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ThemeContextProvider>
            <NextUiProvider>
                <ActiveSectionContextProvider>
                    {children}
                </ActiveSectionContextProvider>
            </NextUiProvider>
        </ThemeContextProvider>
    );
}
