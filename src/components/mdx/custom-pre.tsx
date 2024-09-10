'use client';

import React, { useState } from 'react';
import { GoCheck, GoCopy } from 'react-icons/go';

type CustomPreProps = {
  children: React.ReactNode;
  className?: string;
};

const CustomPre: React.FC<CustomPreProps> = ({ children, className }) => {
  const [isCopied, setIsCopied] = useState(false);
  const language = className?.includes('language-')
    ? className.replace('language-', '').split(' ')[0]
    : 'plaintext';

  const copyToClipboard = () => {
    if (typeof children === 'string') {
      navigator.clipboard.writeText(children).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-white">
        <span>{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-2"
        >
          {isCopied ? (
            <GoCheck className="h-4 w-4" />
          ) : (
            <GoCopy className="h-4 w-4" />
          )}
          <span>{isCopied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className={`${className} relative`}>
        <code className={className}>
          {React.Children.map(children, (child, index) => (
            <span key={index} className="block">
              <span className="inline-block w-8 select-none text-gray-500">
                {index + 1}
              </span>
              {child}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
};

export default CustomPre;
