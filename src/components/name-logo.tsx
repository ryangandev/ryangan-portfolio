import Link from 'next/link';

import { luckiestGuy } from '@/assets/fonts';
import { cn } from '@/lib/utils';

export default function NameLogo({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  // Split the string into an array of <span> elements to apply the overlap effect
  const charSegments = (content: string) => {
    return content.split('').map((char, i, arr) => (
      <span
        key={i}
        className={cn('overlap-child')}
        style={{ '--i': arr.length - i } as React.CSSProperties} // --i is a CSS custom property, used to control the z-index,
      >
        {char}
      </span>
    ));
  };

  return (
    <Link
      href={'/'}
      className={cn(
        'cursor-pointer select-none text-4xl text-opacity-100',
        'text-slate-300 dark:text-slate-500',
        'tracking-[-5px]',
        luckiestGuy.className,
        className,
      )}
    >
      {charSegments(content)}
    </Link>
  );
}
