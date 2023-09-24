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

interface Skill {
    name: string;
    iconType: TechStack;
}

type SkillsData = readonly Skill[];

export { SocialMedia, TechStack };
export type { Skill, SkillsData };
