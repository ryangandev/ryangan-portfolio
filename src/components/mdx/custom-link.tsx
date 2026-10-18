import React from 'react';
import Link from 'next/link';
import { LuArrowUpRight } from 'react-icons/lu';

import { linkArrowClassName, linkClassName } from '@/components/animated-link';
import InPageLink from '@/components/in-page-link';

type CustomLinkProps = React.ComponentPropsWithoutRef<'a'> & {
  href: string;
};

const CustomLink: React.FC<CustomLinkProps> = ({
  href,
  children,
  ...props
}) => {
  // A heading's own link, a footnote, or its way back to the text
  if (href.startsWith('#')) {
    return (
      <InPageLink {...props} href={href}>
        {children}
      </InPageLink>
    );
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
