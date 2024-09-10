import React from 'react';
import Link, { LinkProps } from 'next/link';

type CustomLinkProps = LinkProps & {
  href: string;
};

const CustomLink: React.FC<CustomLinkProps> = ({ href, ...props }) => {
  if (href.startsWith('#')) {
    return <Link {...props} href={href} />;
  }

  return (
    <Link
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-500 hover:dark:text-blue-400"
    />
  );
};

export default CustomLink;
