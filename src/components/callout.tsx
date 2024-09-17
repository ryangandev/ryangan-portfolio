import React from 'react';

import { cn } from '@/lib/utils';

type CalloutProps = {
  children: React.ReactNode;
  type?: 'default' | 'warning' | 'danger';
};

const Callout: React.FC<CalloutProps> = ({
  children,
  type = 'default',
  ...props
}) => {
  return (
    <div
      className={cn('my-6 flex items-start rounded-md border border-l-4 p-4', {
        'border-red-900 bg-red-50': type === 'danger',
        'border-yellow-900 bg-yellow-50': type === 'warning',
      })}
      {...props}
    >
      <div>{children}</div>
    </div>
  );
};

export default Callout;
