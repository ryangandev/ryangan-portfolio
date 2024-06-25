import { BsLinkedin, BsGithub, BsFacebook, BsGlobe } from 'react-icons/bs';
import { HiOutlineMail } from 'react-icons/hi';
import { SocialMedia } from '@/models/data';

interface SocialMediaIconProps {
  type: SocialMedia;
  isDarkMode?: boolean;
}

const ICON_CONFIG = {
  LinkedIn: {
    component: BsLinkedin,
    color: '#007bb5',
    darkColor: '#007bb5',
  },
  GitHub: {
    component: BsGithub,
    color: 'black',
    darkColor: 'white',
  },
  Facebook: {
    component: BsFacebook,
    color: '#4267B2',
    darkColor: '#4267B2',
  },
  Email: {
    component: HiOutlineMail,
    color: '#EA4335',
    darkColor: '#EA4335',
  },
  LiveDemo: {
    component: BsGlobe,
    color: '#000000',
    darkColor: '#ffffff',
  },
};

const SocialMediaIcon = ({
  type,
  isDarkMode = false,
}: SocialMediaIconProps) => {
  const IconComponent = ICON_CONFIG[type].component;
  const color = isDarkMode
    ? ICON_CONFIG[type].darkColor
    : ICON_CONFIG[type].color;

  return (
    <span>
      <IconComponent style={{ color }} />
    </span>
  );
};

export { SocialMediaIcon };
