'use client';

import React, { createContext, useState } from 'react';

interface NavbarContextProviderProps {
    children: React.ReactNode;
}

interface NavbarContextProps {
    navbarVisible: boolean;
    setNavbarVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavbarContext = createContext<NavbarContextProps | null>(null);

const NavbarContextProvider = ({ children }: NavbarContextProviderProps) => {
    const [navbarVisible, setNavbarVisible] = useState<boolean>(true);

    return (
        <NavbarContext.Provider value={{ navbarVisible, setNavbarVisible }}>
            {children}
        </NavbarContext.Provider>
    );
};

export { NavbarContext, NavbarContextProvider };
