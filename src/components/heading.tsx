import React from 'react';

import { cn } from '@/lib/utils';

type HeadingProps = {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  hasMarginBottom?: boolean;
  shadowed?: boolean;
  className?: string;
};

/**
 * Default size is `md` with default margin bottom `20px`, can be overridden by passing custom `className`
 */
const Heading: React.FC<HeadingProps> = ({
  children,
  size = 'md',
  shadowed = false,
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
        shadowed && 'shadow-font',
        className,
      )}
    >
      {children}
    </h1>
  );
};

export default Heading;
