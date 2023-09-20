'use client';

import { useTheme } from '@/hooks/useTheme';
import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeSwitch() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="fixed bottom-5 right-5 sm:bottom-10 sm:right-10 text-xl bg-white w-10 h-10 bg-opacity-80 backdrop-blur-[0.5rem] shadow-2xl outline outline-slate-300 rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950 dark:outline-slate-500"
            onClick={toggleTheme}
        >
            {theme === 'light' ? <FiSun /> : <FiMoon />}
        </button>
    );
}
