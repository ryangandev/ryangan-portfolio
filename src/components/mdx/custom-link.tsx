import React from 'react';
import Link, { LinkProps } from 'next/link';
import { LuArrowUpRight } from 'react-icons/lu';

import { linkArrowClassName, linkClassName } from '@/components/animated-link';

type CustomLinkProps = LinkProps & {
  href: string;
  children: React.ReactNode;
};

const CustomLink: React.FC<CustomLinkProps> = ({
  href,
  children,
  ...props
}) => {
  if (href.startsWith('#')) {
    return <Link {...props} href={href} />;
  }

  return (
    <Link
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClassName}
    >
      {children}
      <LuArrowUpRight className={linkArrowClassName} size={16} />
    </Link>
  );
};

export default CustomLink;
