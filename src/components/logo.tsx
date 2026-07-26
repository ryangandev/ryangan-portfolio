import React from 'react';

import { cn } from '@/lib/utils';

/**
 * The 'R' from Geist SemiBold, outlined so it renders identically to the
 * favicon without loading the font. Normalised to a 100x100 box: the ink box
 * is 56 units tall and centred on (50, 50).
 */
const R_PATH =
  'M28.152 78V22H51.577Q57.651 22 62.068 24.051Q66.485 26.101 68.93 29.887Q71.375 33.673 71.375 38.8Q71.375 43.848 68.575 47.358Q65.775 50.868 61.673 52.13Q69.718 53.313 70.428 61.831L71.848 78H61.437L60.254 63.33Q60.017 59.938 58.124 58.4Q56.231 56.862 51.814 56.862H38.406V78ZM38.406 47.87H50.946Q55.521 47.87 58.163 45.701Q60.806 43.532 60.806 39.431Q60.806 35.33 58.124 33.121Q55.442 30.913 50.473 30.913H38.406Z';

type LogoProps = {
  variant?: 'tile' | 'mark';
  size?: number;
  className?: string;
};

/**
 * @param variant - 'tile' draws the filled squircle with the R knocked out,
 * 'mark' draws the bare letterform. Both paint with `currentColor`, so they
 * invert with the theme on their own.
 * @param size - (optional) the default size is 24
 * @param className - (optional) the logo style
 */
const Logo: React.FC<LogoProps> = ({
  variant = 'tile',
  size = 24,
  className,
}) => {
  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="currentColor"
        aria-hidden="true"
        className={cn(className)}
      >
        <path d={R_PATH} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className={cn(className)}
    >
      <path
        d={`M0 24A24 24 0 0 1 24 0H76A24 24 0 0 1 100 24V76A24 24 0 0 1 76 100H24A24 24 0 0 1 0 76Z ${R_PATH}`}
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default Logo;
