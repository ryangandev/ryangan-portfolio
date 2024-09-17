import React from 'react';

import { cn } from '@/lib/utils';

type HeadingProps = {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  hasMarginBottom?: boolean;
  className?: string;
};

/**
 * Default size is `md` with default margin bottom `20px`, can be overridden by passing custom `className`
 */
const Heading: React.FC<HeadingProps> = ({
  children,
  size = 'md',
  hasMarginBottom = true,
  className,
}) => {
  return (
    <h1
      className={cn(
        {
          'text-2xl md:text-3xl': size === 'sm',
          'text-3xl md:text-4xl': size === 'md',
          'text-4xl md:text-5xl': size === 'lg',
        },
        hasMarginBottom && 'mb-5',
        className,
      )}
    >
      {children}
    </h1>
  );
};

export default Heading;
