'use client';

import { NextUIProvider } from '@nextui-org/react';

interface NextUIProviderProps {
    children: React.ReactNode;
}

const NextUiProviders = ({ children }: NextUIProviderProps) => {
    return <NextUIProvider>{children}</NextUIProvider>;
};

export { NextUiProviders };
