import React from 'react';

import { cn } from '@/lib/utils';

type PageSummaryProps = {
  children: React.ReactNode;
  className?: string;
};

const PageSummary: React.FC<PageSummaryProps> = ({ children, className }) => {
  return <p className={cn('mb-8 leading-7 md:mb-16', className)}>{children}</p>;
};

export default PageSummary;
