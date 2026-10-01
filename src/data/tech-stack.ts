import type { IconType } from 'react-icons';
import { DiMsqlServer } from 'react-icons/di';
import {
  FaAws,
  FaCss3Alt,
  FaDocker,
  FaFigma,
  FaHtml5,
  FaJava,
  FaNodeJs,
  FaReact,
  FaUnity,
} from 'react-icons/fa';
import { PiFileCSharpFill } from 'react-icons/pi';
import {
  SiAkamai,
  SiAntdesign,
  SiAutodeskmaya,
  SiExpo,
  SiExpress,
  SiFirebase,
  SiGit,
  SiJavascript,
  SiMongodb,
  SiMui,
  SiMysql,
  SiNextdotjs,
  SiPhoton,
  SiPm2,
  SiPostgresql,
  SiPostman,
  SiPrisma,
  SiPython,
  SiRacket,
  SiRedux,
  SiSocketdotio,
  SiSpringboot,
  SiSqlite,
  SiSwift,
  SiTailwindcss,
  SiTrello,
  SiTypescript,
  SiVite,
} from 'react-icons/si';
import {
  TbBrandAdobeIllustrator,
  TbBrandAdobePhotoshop,
  TbBrandOauth,
  TbBrandReactNative,
  TbBrandVercel,
} from 'react-icons/tb';

type TechStackEntry = {
  /** How the technology is written for people, e.g. "C#" for `csharp` */
  label: string;
  icon: IconType;
  /** Brand color, with a lighter variant where the brand one vanishes on dark */
  className: string;
};

/**
 * Every technology a project's `techStack:` frontmatter may name, keyed by the
 * slug used there. Code block languages from MDX fences (`csharp`,
 * `typescript`, ...) are looked up here too.
 *
 * `TechStackIconName` is derived from these keys, and the content schema
 * validates frontmatter against them, so a misspelled slug fails the build
 * instead of rendering a placeholder icon.
 */
export const techStack = {
  // Frontend
  react: {
    label: 'React',
    icon: FaReact,
    className: 'text-[#61DAFB]',
  },
  typescript: {
    label: 'TypeScript',
    icon: SiTypescript,
    className: 'text-[#3178C6]',
  },
  javascript: {
    label: 'JavaScript',
    icon: SiJavascript,
    className: 'text-[#F0DB4F]',
  },
  html5: {
    label: 'HTML5',
    icon: FaHtml5,
    className: 'text-[#E34F26]',
  },
  css3: {
    label: 'CSS3',
    icon: FaCss3Alt,
    className: 'text-[#2965F1]',
  },
  nextjs: {
    label: 'Next.js',
    icon: SiNextdotjs,
    className: 'text-[#000000] dark:text-[#FFFFFF]',
  },
  redux: {
    label: 'Redux',
    icon: SiRedux,
    className: 'text-[#764ABC] dark:text-[#9E7BFF]',
  },
  tailwindcss: {
    label: 'Tailwind CSS',
    icon: SiTailwindcss,
    className: 'text-[#06B6D4]',
  },
  vite: {
    label: 'Vite',
    icon: SiVite,
    className: 'text-[#646CFF] dark:text-[#8C92FF]',
  },
  expo: {
    label: 'Expo',
    icon: SiExpo,
    className: 'text-[#000020] dark:text-[#ffffdf]',
  },
  reactnative: {
    label: 'React Native',
    icon: TbBrandReactNative,
    className: 'text-[#61dafb]',
  },
  swift: {
    label: 'Swift',
    icon: SiSwift,
    className: 'text-[#F05138]',
  },

  // Backend
  nodejs: {
    label: 'Node.js',
    icon: FaNodeJs,
    className: 'text-[#339933]',
  },
  express: {
    label: 'Express',
    icon: SiExpress,
    className: 'text-[#000000] dark:text-[#ffffff]',
  },
  springboot: {
    label: 'Spring Boot',
    icon: SiSpringboot,
    className: 'text-[#6DB33F]',
  },
  socketio: {
    label: 'Socket.IO',
    icon: SiSocketdotio,
    className: 'text-[#010101] dark:text-[#fefefe]',
  },
  python: {
    label: 'Python',
    icon: SiPython,
    className: 'text-[#3776AB]',
  },
  java: {
    label: 'Java',
    icon: FaJava,
    className: 'text-[#007396] dark:text-[#87bEEB]',
  },
  csharp: {
    label: 'C#',
    // Simple Icons dropped the C# mark, and Tabler's is the bare letters, which
    // read as a stutter next to the "C#" label. A C# source file does not.
    icon: PiFileCSharpFill,
    className: 'text-[#239120]',
  },
  racket: {
    label: 'Racket',
    icon: SiRacket,
    className: 'text-[#9F1D20]',
  },

  // Database
  sqlite: {
    label: 'SQLite',
    icon: SiSqlite,
    className: 'text-[#003B57] dark:text-[#1791C0]',
  },
  postgresql: {
    label: 'PostgreSQL',
    icon: SiPostgresql,
    className: 'text-[#4169E1]',
  },
  mysql: {
    label: 'MySQL',
    icon: SiMysql,
    className: 'text-[#4479A1]',
  },
  sqlserver: {
    label: 'SQL Server',
    icon: DiMsqlServer,
    className: 'text-[#CC2927]',
  },
  mongodb: {
    label: 'MongoDB',
    icon: SiMongodb,
    className: 'text-[#47A248]',
  },
  prisma: {
    label: 'Prisma',
    icon: SiPrisma,
    className: 'text-[#1B222D] dark:text-[#e4ddd2]',
  },

  // UI/UX
  figma: {
    label: 'Figma',
    icon: FaFigma,
    className: 'text-[#F24E1E]',
  },
  adobeps: {
    label: 'Photoshop',
    icon: TbBrandAdobePhotoshop,
    className: 'text-blue-600 dark:text-blue-500',
  },
  adobeai: {
    label: 'Illustrator',
    icon: TbBrandAdobeIllustrator,
    className: 'text-[#E65100] dark:text-[#FF9A00]',
  },
  mui: {
    label: 'MUI',
    icon: SiMui,
    className: 'text-[#0081CB]',
  },
  antdesign: {
    label: 'Ant Design',
    icon: SiAntdesign,
    className: 'text-[#1890FF]',
  },
  maya: {
    label: 'Maya',
    icon: SiAutodeskmaya,
    className: 'text-teal-600',
  },

  // Deployment
  vercel: {
    label: 'Vercel',
    icon: TbBrandVercel,
    className: 'text-[#000000] dark:text-[#FFFFFF]',
  },
  aws: {
    label: 'AWS',
    icon: FaAws,
    className: 'text-[#FF9900]',
  },
  akamai: {
    label: 'Akamai',
    icon: SiAkamai,
    className: 'text-[#0096D6]',
  },
  docker: {
    label: 'Docker',
    icon: FaDocker,
    className: 'text-[#2496ED]',
  },
  pm2: {
    label: 'PM2',
    icon: SiPm2,
    className: 'text-[#2B037A] dark:text-[#8E79F1]',
  },

  // Tools & Other
  unity: {
    label: 'Unity',
    icon: FaUnity,
    className: 'text-[#000000] dark:text-[#ffffff]',
  },
  photon: {
    label: 'Photon',
    icon: SiPhoton,
    className: 'text-[#00B4D8] dark:text-[#90E0Ef]',
  },
  git: {
    label: 'Git',
    icon: SiGit,
    className: 'text-[#F05032]',
  },
  postman: {
    label: 'Postman',
    icon: SiPostman,
    className: 'text-[#FF6C37]',
  },
  oauth: {
    label: 'OAuth',
    icon: TbBrandOauth,
    className: 'text-[#000000] dark:text-[#ffffff]',
  },
  firebase: {
    label: 'Firebase',
    icon: SiFirebase,
    className: 'text-[#FFCA28]',
  },
  trello: {
    label: 'Trello',
    icon: SiTrello,
    className: 'text-[#0052CC] dark:text-[#0079BF]',
  },
} as const satisfies Record<string, TechStackEntry>;

export type TechStackIconName = keyof typeof techStack;

export const techStackNames = Object.keys(techStack) as [
  TechStackIconName,
  ...TechStackIconName[],
];

export const isTechStackIconName = (
  value: string | undefined,
): value is TechStackIconName =>
  value !== undefined && Object.hasOwn(techStack, value);
