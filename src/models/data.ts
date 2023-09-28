enum SocialMedia {
    LinkedIn = 'LinkedIn',
    GitHub = 'GitHub',
    Facebook = 'Facebook',
    Email = 'Email',
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
    MUI = 'MUI',
    Antdesign = 'Antdesign',

    // Deployment
    Vercel = 'Vercel',
    AWS = 'AWS',
    Akamai = 'Akamai',
    Docker = 'Docker',

    // Tools & Other
    Unity = 'Unity',
    Git = 'Git',
    Postman = 'Postman',
    OAuth = 'OAuth',
    Firebase = 'Firebase',
}

interface Icon {
    name: string;
    iconType: TechStack;
}

type IconsData = readonly Icon[];

type Project = {
    projectTitle: string;
    role: string;
    techUsed: IconsData;
    context: string;
    overview: readonly string[];
    features: readonly { title: string; detail: string }[];
    responsibilities: readonly string[];
    // thumbnailUrl: StaticImageData;
    thumbnailUrl: string; // temporary solution to fix the build error
    screenshotUrls: readonly string[];
};

type ProjectsData = readonly Project[];

export { SocialMedia, TechStack };
export type { Icon, IconsData, Project, ProjectsData };
