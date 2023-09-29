import { SkillsData, TechStack } from '@/models/data';

export const skillsData: SkillsData = [
    // Languages
    { name: 'Python', iconType: TechStack.Python },
    { name: 'Java', iconType: TechStack.Java },
    { name: 'TypeScript', iconType: TechStack.TypeScript },
    { name: 'JavaScript', iconType: TechStack.JavaScript },
    { name: 'HTML5', iconType: TechStack.HTML5 },
    { name: 'CSS3', iconType: TechStack.CSS3 },
    { name: 'C#', iconType: TechStack.CSharp },
    { name: 'Swift', iconType: TechStack.Swift },
    { name: 'Racket', iconType: TechStack.Racket },

    // Frontend & Design
    { name: 'React', iconType: TechStack.React },
    { name: 'React Native', iconType: TechStack.ReactNative },
    { name: 'Next.js', iconType: TechStack.NextJS },
    { name: 'Expo', iconType: TechStack.Expo },
    { name: 'Tailwind CSS', iconType: TechStack.TailwindCSS },
    { name: 'Redux', iconType: TechStack.Redux },
    { name: 'Figma', iconType: TechStack.Figma },

    // Backend & Database
    { name: 'Node.js', iconType: TechStack.NodeJS },
    { name: 'Express', iconType: TechStack.Express },
    { name: 'Spring Boot', iconType: TechStack.SpringBoot },
    { name: 'Socket.IO', iconType: TechStack.SocketIO },
    { name: 'PostgreSQL', iconType: TechStack.PostgreSQL },
    { name: 'MySQL', iconType: TechStack.MySQL },
    { name: 'SQLite', iconType: TechStack.SQLite },
    { name: 'SQL Server', iconType: TechStack.SQLServer },
    { name: 'MongoDB', iconType: TechStack.MongoDB },
    { name: 'Prisma', iconType: TechStack.Prisma },

    // Cloud & Deployment
    { name: 'Vercel', iconType: TechStack.Vercel },
    { name: 'AWS', iconType: TechStack.AWS },
    { name: 'Linode', iconType: TechStack.Akamai },

    // Tools & Other
    { name: 'Git', iconType: TechStack.Git },
    { name: 'Postman', iconType: TechStack.Postman },
    { name: 'OAuth', iconType: TechStack.OAuth },
    { name: 'Firebase', iconType: TechStack.Firebase },
    { name: 'Docker', iconType: TechStack.Docker },
    { name: 'Unity', iconType: TechStack.Unity },
] as const;
