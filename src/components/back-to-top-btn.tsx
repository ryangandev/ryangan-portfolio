'use client';

import { useActiveSection } from '@/hooks/useActiveSection';
import clsx from 'clsx';
import React from 'react';
import { AiOutlineArrowUp } from 'react-icons/ai';
import Tooltip from './tooltip';

export default function BackToTopButton() {
    const { activeSection } = useActiveSection();

    const handleBackToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            className={clsx(
                `fixed bottom-20 right-6 sm:bottom-24 sm:right-10 text-xl bg-white w-10 h-10 bg-opacity-80 backdrop-blur-[0.5rem] shadow-2xl outline outline-slate-300 rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950 dark:outline-slate-500`,
                { 'opacity-0': activeSection === 'Home' },
            )}
            onClick={handleBackToTop}
        >
            <Tooltip title="Back To Top">
                <AiOutlineArrowUp />
            </Tooltip>
        </button>
    );
}
