import { BsLinkedin, BsGithub, BsFacebook } from 'react-icons/bs';
import { HiOutlineMail } from 'react-icons/hi';
import { SocialMedia } from '@/models/data';
import Tooltip from '@/components/tooltip';

interface SocialMediaIconProps {
    type: SocialMedia;
}

const ICON_CONFIG = {
    LinkedIn: {
        component: BsLinkedin,
        color: '#007bb5',
    },
    GitHub: {
        component: BsGithub,
        color: 'black',
    },
    Facebook: {
        component: BsFacebook,
        color: '#4267B2',
    },
    Email: {
        component: HiOutlineMail,
        color: '#EA4335',
    },
};

const SocialMediaIcon = ({ type }: SocialMediaIconProps) => {
    const IconComponent = ICON_CONFIG[type].component;
    const color = ICON_CONFIG[type].color;

    return (
        <Tooltip title={type}>
            <IconComponent style={{ color }} />
        </Tooltip>
    );
};

export { SocialMediaIcon };
