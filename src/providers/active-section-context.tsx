'use client';

import type { SectionName } from '@/models/section';
import React, { createContext, useState } from 'react';

interface ActiveSectionContextProviderProps {
    children: React.ReactNode;
}

interface ActiveSectionContextProps {
    activeSection: SectionName;
    setActiveSection: React.Dispatch<React.SetStateAction<SectionName>>;
    timeOfLastClick: number;
    setTimeOfLastClick: React.Dispatch<React.SetStateAction<number>>;
}

const ActiveSectionContext = createContext<ActiveSectionContextProps | null>(
    null,
);

const ActiveSectionContextProvider = ({
    children,
}: ActiveSectionContextProviderProps) => {
    const [activeSection, setActiveSection] = useState<SectionName>('Home');
    // keep track of the time of the last click to prevent intersection observer from firing when user clicks on navbar
    const [timeOfLastClick, setTimeOfLastClick] = useState<number>(0);

    return (
        <ActiveSectionContext.Provider
            value={{
                activeSection,
                setActiveSection,
                timeOfLastClick,
                setTimeOfLastClick,
            }}
        >
            {children}
        </ActiveSectionContext.Provider>
    );
};

export { ActiveSectionContext, ActiveSectionContextProvider };
