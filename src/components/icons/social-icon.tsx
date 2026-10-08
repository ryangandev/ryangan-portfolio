import React from 'react';
import type { IconType } from 'react-icons';
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

/** A record rather than a switch, so a new name cannot be added without an icon */
const icons: Record<SocialIconName, IconType> = {
  linkedin: TbBrandLinkedin,
  github: TbBrandGithub,
  discord: TbBrandDiscord,
  medium: TbBrandMedium,
  email: TbMail,
  location: TbMapPin,
  website: TbWorld,
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
  const Icon = icons[name];
  return <Icon size={size} className={cn(className)} />;
};

export default SocialIcon;
