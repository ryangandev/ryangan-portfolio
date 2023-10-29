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
    SiMui,
    SiAntdesign,
    SiPm2,
} from 'react-icons/si';
import { TbBrandReactNative, TbBrandOauth } from 'react-icons/tb';

interface TechStackIconProps {
    type: TechStack;
    isDarkMode?: boolean;
}

const ICON_CONFIG = {
    // Frontend
    React: {
        component: FaReact,
        color: '#61DAFB',
        darkColor: '#61DAFB',
    },
    TypeScript: {
        component: SiTypescript,
        color: '#3178C6',
        darkColor: '#3178C6',
    },
    JavaScript: {
        component: SiJavascript,
        color: '#F7DF1E',
        darkColor: '#F7DF1E',
    },
    HTML5: {
        component: FaHtml5,
        color: '#E34F26',
        darkColor: '#E34F26',
    },
    CSS3: {
        component: FaCss3Alt,
        color: '#1572B6',
        darkColor: '#1572B6',
    },
    NextJS: {
        component: SiNextdotjs,
        color: '#000000',
        darkColor: '#ffffff',
    },
    Redux: {
        component: SiRedux,
        color: '#764ABC',
        darkColor: '#764ABC',
    },
    TailwindCSS: {
        component: SiTailwindcss,
        color: '#06B6D4',
        darkColor: '#06B6D4',
    },
    Expo: {
        component: SiExpo,
        color: '#000020',
        darkColor: '#ffffdf',
    },
    ReactNative: {
        component: TbBrandReactNative,
        color: '#61dafb',
        darkColor: '#61dafb',
    },
    Swift: {
        component: SiSwift,
        color: '#F05138',
        darkColor: '#F05138',
    },

    // Backend
    NodeJS: {
        component: FaNodeJs,
        color: '#339933',
        darkColor: '#339933',
    },
    Express: {
        component: SiExpress,
        color: '#000000',
        darkColor: '#ffffff',
    },
    SpringBoot: {
        component: SiSpringboot,
        color: '#6DB33F',
        darkColor: '#6DB33F',
    },
    SocketIO: {
        component: SiSocketdotio,
        color: '#010101',
        darkColor: '#fefefe',
    },
    Python: {
        component: SiPython,
        color: '#3776AB',
        darkColor: '#3776AB',
    },
    Java: {
        component: FaJava,
        color: '#007396',
        darkColor: '#007396',
    },
    CSharp: {
        component: SiCsharp,
        color: '#99CC00',
        darkColor: '#99CC00',
    },
    Racket: {
        component: SiRacket,
        color: '#9F1D20',
        darkColor: '#9F1D20',
    },

    // Database
    SQLite: {
        component: SiSqlite,
        color: '#003B57',
        darkColor: '#003B57',
    },
    PostgreSQL: {
        component: SiPostgresql,
        color: '#4169E1',
        darkColor: '#4169E1',
    },
    MySQL: {
        component: SiMysql,
        color: '#4479A1',
        darkColor: '#4479A1',
    },
    SQLServer: {
        component: SiMicrosoftsqlserver,
        color: '#CC2927',
        darkColor: '#CC2927',
    },
    MongoDB: {
        component: SiMongodb,
        color: '#47A248',
        darkColor: '#47A248',
    },
    Prisma: {
        component: SiPrisma,
        color: '#1B222D',
        darkColor: '#e4ddd2',
    },

    // UI/UX
    Figma: {
        component: FaFigma,
        color: '#F24E1E',
        darkColor: '#F24E1E',
    },
    AdobePs: {
        component: SiAdobephotoshop,
        color: '#31A8FF',
        darkColor: '#31A8FF',
    },
    MUI: {
        component: SiMui,
        color: '#0081CB',
        darkColor: '#0081CB',
    },
    Antdesign: {
        component: SiAntdesign,
        color: '#1890FF',
        darkColor: '#1890FF',
    },

    // Deployment
    Vercel: {
        component: SiVercel,
        color: '#000000',
        darkColor: '#ffffff',
    },
    AWS: {
        component: FaAws,
        color: '#FF9900',
        darkColor: '#FF9900',
    },
    Akamai: {
        component: SiAkamai,
        color: '#0096D6',
        darkColor: '#0096D6',
    },
    Docker: {
        component: FaDocker,
        color: '#2496ED',
        darkColor: '#2496ED',
    },
    Pm2: {
        component: SiPm2,
        color: '#2B037A',
        darkColor: '#6B43BA',
    },

    // Tools
    Unity: {
        component: FaUnity,
        color: '#000000',
        darkColor: '#ffffff',
    },
    Git: {
        component: SiGit,
        color: '#F05032',
        darkColor: '#F05032',
    },
    Postman: {
        component: SiPostman,
        color: '#FF6C37',
        darkColor: '#FF6C37',
    },
    OAuth: {
        component: TbBrandOauth,
        color: '#000000',
        darkColor: '#ffffff',
    },
    Firebase: {
        component: SiFirebase,
        color: '#FFCA28',
        darkColor: '#FFCA28',
    },
};

const TechStackIcon = ({ type, isDarkMode = false }: TechStackIconProps) => {
    const IconComponent = ICON_CONFIG[type].component;
    const color = isDarkMode
        ? ICON_CONFIG[type].darkColor
        : ICON_CONFIG[type].color;

    return (
        <Tooltip title={type}>
            <IconComponent style={{ color }} />
        </Tooltip>
    );
};

export { TechStackIcon };
