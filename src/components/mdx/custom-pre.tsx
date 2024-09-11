'use client';

import React, { useRef, useState } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GoCheck, GoCopy } from 'react-icons/go';
import { toast } from 'sonner';

import TechStackIcon from '@/components/icons/tech-stack-icon';
import { cn } from '@/lib/utils';
import { TechStackIconName } from '@/models/data';

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
      <div className="absolute top-0 flex w-full items-center justify-between space-x-2 rounded-t-md py-2 pl-6 pr-4">
        <span
          className={cn(
            'flex items-center text-[13px] font-semibold uppercase text-gray-200',
            GeistSans.className,
          )}
        >
          <TechStackIcon
            name={language as TechStackIconName}
            size={16}
            className="mr-2"
          />
          {language}
        </span>

        <button
          onClick={handleCopyToClipboard}
          className="rounded-md p-1.5 text-gray-200 transition-colors hover:bg-gray-700"
        >
          {isCopied ? (
            <GoCheck size={20} className="text-green-400" />
          ) : (
            <GoCopy size={20} />
          )}
        </button>
      </div>
      <pre
        ref={preRef}
        className={cn('mt-2 pt-12', className)}
        data-language={language}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
};

export default CustomPre;
