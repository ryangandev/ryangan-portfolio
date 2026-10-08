'use client';

import React, { useRef, useState } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GoCheck, GoCopy } from 'react-icons/go';
import { LuCode } from 'react-icons/lu';
import { toast } from 'sonner';

import TechStackIcon from '@/components/icons/tech-stack-icon';
import { cn } from '@/lib/utils';
import { isTechStackIconName, techStack } from '@/data/tech-stack';

type CustomPreProps = {
  children: React.ReactNode;
  className?: string;
  'data-language'?: string;
};

const CustomPre: React.FC<CustomPreProps> = ({
  children,
  className,
  'data-language': language,
  ...props
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopyToClipboard = async () => {
    if (preRef.current && !isCopied) {
      try {
        const codeElement = preRef.current.querySelector('code');
        const fullCode = codeElement ? codeElement.textContent : '';
        await navigator.clipboard.writeText(fullCode || '');
        setIsCopied(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy. Please try again.');
      }
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-0 flex w-full items-center justify-between space-x-2 rounded-t-md border-b px-4 py-2">
        <span
          className={cn(
            'flex items-center text-[13px] font-semibold uppercase',
            GeistSans.className,
          )}
        >
          {isTechStackIconName(language) ? (
            <TechStackIcon name={language} size={16} className="mr-2" />
          ) : (
            <LuCode size={16} className="mr-2 color-level-4" aria-hidden />
          )}
          {isTechStackIconName(language) ? techStack[language].label : language}
        </span>

        <button
          onClick={handleCopyToClipboard}
          className="rounded-md p-1.5 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
        >
          {isCopied ? (
            <GoCheck size={20} className="text-green-700 dark:text-green-300" />
          ) : (
            <GoCopy size={20} />
          )}
        </button>
      </div>
      <pre
        ref={preRef}
        className={cn('mt-2 rounded-md border px-4 pt-[68px] pb-5', className)}
        data-language={language}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
};

export default CustomPre;
