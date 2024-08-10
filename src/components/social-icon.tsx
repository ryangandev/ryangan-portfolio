import React from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { BiLogoLinkedin } from 'react-icons/bi';
import { BsGlobe } from 'react-icons/bs';
import { FaDiscord, FaMedium } from 'react-icons/fa6';
import { MdLocationPin, MdOutlineEmail } from 'react-icons/md';
import { SiCodesandbox } from 'react-icons/si';

import { cn } from '@/lib/utils';
import { SocialIconName } from '@/models/data';

type SocialIconProps = {
  name: SocialIconName;
  size?: number;
  className?: string;
};

const SocialIcon: React.FC<SocialIconProps> = ({ name, size, className }) => {
  switch (name) {
    case 'linkedin':
      return <BiLogoLinkedin size={size} className={cn(className)} />;
    case 'github':
      return <AiFillGithub size={size} className={cn(className)} />;
    case 'discord':
      return <FaDiscord size={size} className={cn(className)} />;
    case 'medium':
      return <FaMedium size={size} className={cn(className)} />;
    case 'email':
      return <MdOutlineEmail size={size} className={cn(className)} />;
    case 'location':
      return <MdLocationPin size={size} className={cn(className)} />;
    case 'website':
      return <BsGlobe size={size} className={cn(className)} />;
    default:
      return (
        <SiCodesandbox
          size={size}
          className={cn('text-slate-900 dark:text-slate-800', className)}
        />
      );
  }
};

export default SocialIcon;
