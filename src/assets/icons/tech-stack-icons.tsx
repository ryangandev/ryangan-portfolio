import Tooltip from '@/components/tooltip';
import { TechStack } from '@/models/icon';
import {
    FaReact,
    FaNodeJs,
    FaHtml5,
    FaCss3Alt,
    FaFigma,
    FaUnity,
    FaAws,
    FaDocker,
} from 'react-icons/fa';
import {
    SiNextdotjs,
    SiSqlite,
    SiTailwindcss,
    SiSocketdotio,
    SiJavascript,
    SiTypescript,
    SiExpo,
    SiPostgresql,
    SiSwift,
    SiRedux,
    SiSpringboot,
    SiAdobephotoshop,
    SiVercel,
    SiAkamai,
} from 'react-icons/si';
import { TbBrandReactNative } from 'react-icons/tb';

interface TechStackIconProps {
    type: TechStack;
}

const ICON_CONFIG = {
    // Frontend
    React: {
        component: FaReact,
        color: '#61DAFB',
    },
    TypeScript: {
        component: SiTypescript,
        color: '#3178C6',
    },
    JavaScript: {
        component: SiJavascript,
        color: '#F7DF1E',
    },
    HTML5: {
        component: FaHtml5,
        color: '#E34F26',
    },
    CSS3: {
        component: FaCss3Alt,
        color: '#1572B6',
    },
    NextJS: {
        component: SiNextdotjs,
        color: '#000000',
    },
    Redux: {
        component: SiRedux,
        color: '#764ABC',
    },
    TailwindCSS: {
        component: SiTailwindcss,
        color: '#06B6D4',
    },
    Expo: {
        component: SiExpo,
        color: '#000020',
    },
    ReactNative: {
        component: TbBrandReactNative,
        color: '#61dafb',
    },
    Swift: {
        component: SiSwift,
        color: '#F05138',
    },
    Unity: {
        component: FaUnity,
        color: '#000000',
    },

    // Backend
    NodeJS: {
        component: FaNodeJs,
        color: '#339933',
    },
    SpringBoot: {
        component: SiSpringboot,
        color: '#6DB33F',
    },
    SocketIO: {
        component: SiSocketdotio,
        color: '#010101',
    },

    // Database
    SQLite: {
        component: SiSqlite,
        color: '#003B57',
    },
    PostgreSQL: {
        component: SiPostgresql,
        color: '#4169E1',
    },

    // UI/UX
    Figma: {
        component: FaFigma,
        color: '#F24E1E',
    },
    AdobePs: {
        component: SiAdobephotoshop,
        color: '#31A8FF',
    },

    // Deployment
    Vercel: {
        component: SiVercel,
        color: '#000000',
    },
    AWS: {
        component: FaAws,
        color: '#232F3E',
    },
    Akamai: {
        component: SiAkamai,
        color: '#0096D6',
    },
    Docker: {
        component: FaDocker,
        color: '#2496ED',
    },
};

const TechStackIcon = ({ type }: TechStackIconProps) => {
    const IconComponent = ICON_CONFIG[type].component;
    const color = ICON_CONFIG[type].color;

    return (
        <Tooltip title={type}>
            <IconComponent style={{ color }} />
        </Tooltip>
    );
};

export { TechStackIcon };
