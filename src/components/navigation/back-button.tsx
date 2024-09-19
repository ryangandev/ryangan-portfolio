import Link from 'next/link';
import { GoArrowUpLeft } from 'react-icons/go';

import { cn } from '@/lib/utils';

type BackButtonProps = {
  className?: string;
  name: string;
  href: string;
};

export default function BackButton({ className, name, href }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        'mb-8 flex items-center text-lg font-medium italic lg:absolute lg:-left-48',
        className,
      )}
    >
      <GoArrowUpLeft className="mr-2 inline-block h-6 w-6" />
      {name}
    </Link>
  );
}
