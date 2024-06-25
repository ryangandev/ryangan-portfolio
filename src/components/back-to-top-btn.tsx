'use client';

import { useActiveSection } from '@/hooks/useActiveSection';
import clsx from 'clsx';
import React from 'react';
import { AiOutlineArrowUp } from 'react-icons/ai';

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
        `fixed bottom-20 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white bg-opacity-80 text-xl shadow-2xl outline outline-slate-300 backdrop-blur-[0.5rem] transition-all hover:scale-[1.15] active:scale-105 dark:bg-gray-950 dark:outline-slate-500 sm:bottom-24 sm:right-10`,
        { '-translate-y-4 opacity-0': activeSection === 'Home' },
      )}
      onClick={handleBackToTop}
    >
      <span>
        <AiOutlineArrowUp />
      </span>
    </button>
  );
}
