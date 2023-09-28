'use client';

import { NextUIProvider } from '@nextui-org/react';

interface NextUIProviderProps {
    children: React.ReactNode;
}

const NextUiProvider = ({ children }: NextUIProviderProps) => {
    return <NextUIProvider>{children}</NextUIProvider>;
};

export { NextUiProvider };
