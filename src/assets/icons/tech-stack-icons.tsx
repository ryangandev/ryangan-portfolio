import Tooltip from '@/components/tooltip';
import { TechStack } from '@/models/data';
import {
    FaReact,
    FaNodeJs,
    FaHtml5,
    FaCss3Alt,
    FaFigma,
    FaUnity,
    FaAws,
    FaDocker,
    FaJava,
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
    SiPython,
    SiCsharp,
    SiRacket,
    SiExpress,
    SiGit,
    SiMysql,
    SiMicrosoftsqlserver,
    SiMongodb,
    SiPrisma,
    SiPostman,
    SiFirebase,
} from 'react-icons/si';
import { TbBrandReactNative, TbBrandOauth } from 'react-icons/tb';

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

    // Backend
    NodeJS: {
        component: FaNodeJs,
        color: '#339933',
    },
    Express: {
        component: SiExpress,
        color: '#000000',
    },
    SpringBoot: {
        component: SiSpringboot,
        color: '#6DB33F',
    },
    SocketIO: {
        component: SiSocketdotio,
        color: '#010101',
    },
    Python: {
        component: SiPython,
        color: '#3776AB',
    },
    Java: {
        component: FaJava,
        color: '#007396',
    },
    CSharp: {
        component: SiCsharp,
        color: '#99CC00',
    },
    Racket: {
        component: SiRacket,
        color: '#9F1D20',
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
    MySQL: {
        component: SiMysql,
        color: '#4479A1',
    },
    SQLServer: {
        component: SiMicrosoftsqlserver,
        color: '#CC2927',
    },
    MongoDB: {
        component: SiMongodb,
        color: '#47A248',
    },
    Prisma: {
        component: SiPrisma,
        color: '#1B222D',
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
        color: '#FF9900',
    },
    Akamai: {
        component: SiAkamai,
        color: '#0096D6',
    },
    Docker: {
        component: FaDocker,
        color: '#2496ED',
    },

    // Tools
    Unity: {
        component: FaUnity,
        color: '#000000',
    },
    Git: {
        component: SiGit,
        color: '#F05032',
    },
    Postman: {
        component: SiPostman,
        color: '#FF6C37',
    },
    OAuth: {
        component: TbBrandOauth,
        color: '#000000',
    },
    Firebase: {
        component: SiFirebase,
        color: '#FFCA28',
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
