import React from 'react';

import { cn } from '@/lib/utils';

type CalloutProps = {
  children: React.ReactNode;
  type?: 'default' | 'warning' | 'danger';
};

/**
 * The non-default variants set a light background with no `dark:` counterpart,
 * so in dark mode they rendered near-black prose on near-white. Nothing passes
 * `type` from the app today — MDX can, since `Callout` is exposed to it in
 * `mdx-components.tsx` — so the bug was latent rather than visible.
 *
 * The default variant deliberately keeps the theme's own border and
 * background, so a plain callout reads as a quiet inset rather than an alert.
 */
const Callout: React.FC<CalloutProps> = ({
  children,
  type = 'default',
  ...props
}) => {
  return (
    <div
      className={cn('my-6 flex items-start rounded-md border border-l-4 p-4', {
        'border-l-red-700 bg-red-50 dark:border-l-red-400 dark:bg-red-950/40':
          type === 'danger',
        'border-l-yellow-700 bg-yellow-50 dark:border-l-yellow-400 dark:bg-yellow-950/40':
          type === 'warning',
      })}
      {...props}
    >
      <div>{children}</div>
    </div>
  );
};

export default Callout;
