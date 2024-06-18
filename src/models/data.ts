import { StaticImageData } from 'next/image';

enum SocialMedia {
  LinkedIn = 'LinkedIn',
  GitHub = 'GitHub',
  Facebook = 'Facebook',
  Email = 'Email',
  LiveDemo = 'LiveDemo',
}

enum TechStack {
  // Frontend
  React = 'React',
  TypeScript = 'TypeScript',
  JavaScript = 'JavaScript',
  HTML5 = 'HTML5',
  CSS3 = 'CSS3',
  NextJS = 'NextJS',
  Redux = 'Redux',
  TailwindCSS = 'TailwindCSS',
  Expo = 'Expo',
  ReactNative = 'ReactNative',
  Swift = 'Swift',

  // Backend
  NodeJS = 'NodeJS',
  Express = 'Express',
  SpringBoot = 'SpringBoot',
  SocketIO = 'SocketIO',
  Python = 'Python',
  Java = 'Java',
  CSharp = 'CSharp',
  Racket = 'Racket',

  // Database
  SQLite = 'SQLite',
  PostgreSQL = 'PostgreSQL',
  MySQL = 'MySQL',
  SQLServer = 'SQLServer',
  MongoDB = 'MongoDB',
  Prisma = 'Prisma',

  // UI/UX
  Figma = 'Figma',
  AdobePs = 'AdobePs',
  AdobeAi = 'AdobeAi',
  MUI = 'MUI',
  Antdesign = 'Antdesign',

  // Deployment
  Vercel = 'Vercel',
  AWS = 'AWS',
  Akamai = 'Akamai',
  Docker = 'Docker',
  Pm2 = 'Pm2',

  // Tools & Other
  Unity = 'Unity',
  Git = 'Git',
  Postman = 'Postman',
  OAuth = 'OAuth',
  Firebase = 'Firebase',
  Trello = 'Trello',
}

type Icon = TechStack | SocialMedia;

interface IconData {
  name: string;
  icon: Icon;
}

type projectLinkType = 'View Code' | 'Live Demo';
type IconsData = readonly IconData[];

type Project = {
  projectTitle: string;
  role: string;
  sources: readonly {
    name: projectLinkType;
    icon: Icon;
    url: string;
  }[];
  techUsed: IconsData;
  context: string;
  overview: readonly string[];
  features: readonly { title: string; detail: string }[];
  responsibilities: readonly string[];
  thumbnailUrl: StaticImageData;
  screenshotUrls: readonly StaticImageData[];
};

type ProjectsData = readonly Project[];
type SkillsData = IconsData;

export { SocialMedia, TechStack };
export type { Icon, IconData, IconsData, Project, ProjectsData, SkillsData };
