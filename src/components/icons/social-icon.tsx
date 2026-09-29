import React from 'react';
import { SiCodesandbox } from 'react-icons/si';
import {
  TbBrandDiscord,
  TbBrandGithub,
  TbBrandLinkedin,
  TbBrandMedium,
  TbMail,
  TbMapPin,
  TbWorld,
} from 'react-icons/tb';

import { cn } from '@/lib/utils';
import { SocialIconName } from '@/models/data';

type SocialIconProps = {
  name: SocialIconName;
  size?: number;
  className?: string;
};

/**
 * All from Tabler's outline set, so they share one stroke with each other and
 * with the Lucide icons beside them, like the copy button and the external
 * link arrow. They were once a mix of five sets, outlined and filled.
 *
 * @param name - the name of the social icon
 * @param size - (optional) the default size is 24
 * @param className - (optional) the icon style
 */
const SocialIcon: React.FC<SocialIconProps> = ({
  name,
  size = 24,
  className,
}) => {
  switch (name) {
    case 'linkedin':
      return <TbBrandLinkedin size={size} className={cn(className)} />;
    case 'github':
      return <TbBrandGithub size={size} className={cn(className)} />;
    case 'discord':
      return <TbBrandDiscord size={size} className={cn(className)} />;
    case 'medium':
      return <TbBrandMedium size={size} className={cn(className)} />;
    case 'email':
      return <TbMail size={size} className={cn(className)} />;
    case 'location':
      return <TbMapPin size={size} className={cn(className)} />;
    case 'website':
      return <TbWorld size={size} className={cn(className)} />;
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
