import React from 'react';
import Link, { LinkProps } from 'next/link';
import { LuArrowUpRight } from 'react-icons/lu';

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
      className="group font-medium text-gray-700 decoration-gray-400 underline-offset-[3px] transition-colors hover:decoration-gray-700 dark:text-gray-300 dark:decoration-[#3b3b3b] dark:hover:decoration-gray-300"
    >
      {children}
      <LuArrowUpRight
        className="inline-block text-gray-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gray-700 dark:text-[#3b3b3b] dark:group-hover:text-gray-300"
        size={16}
      />
    </Link>
  );
};

export default CustomLink;
