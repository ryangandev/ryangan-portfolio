import { SkillsData, TechStack } from '@/models/data';

export const skillsData: SkillsData = [
  // Languages
  { name: 'Python', icon: TechStack.Python },
  { name: 'Java', icon: TechStack.Java },
  { name: 'TypeScript', icon: TechStack.TypeScript },
  { name: 'JavaScript', icon: TechStack.JavaScript },
  { name: 'HTML5', icon: TechStack.HTML5 },
  { name: 'CSS3', icon: TechStack.CSS3 },
  { name: 'C#', icon: TechStack.CSharp },
  { name: 'Swift', icon: TechStack.Swift },
  { name: 'Racket', icon: TechStack.Racket },

  // Frontend & Design
  { name: 'React', icon: TechStack.React },
  { name: 'React Native', icon: TechStack.ReactNative },
  { name: 'Next.js', icon: TechStack.NextJS },
  { name: 'Expo', icon: TechStack.Expo },
  { name: 'Tailwind CSS', icon: TechStack.TailwindCSS },
  { name: 'Redux', icon: TechStack.Redux },
  { name: 'Figma', icon: TechStack.Figma },

  // Backend & Database
  { name: 'Node.js', icon: TechStack.NodeJS },
  { name: 'Express', icon: TechStack.Express },
  { name: 'Spring Boot', icon: TechStack.SpringBoot },
  { name: 'Socket.IO', icon: TechStack.SocketIO },
  { name: 'PostgreSQL', icon: TechStack.PostgreSQL },
  { name: 'MySQL', icon: TechStack.MySQL },
  { name: 'SQLite', icon: TechStack.SQLite },
  { name: 'SQL Server', icon: TechStack.SQLServer },
  { name: 'MongoDB', icon: TechStack.MongoDB },
  { name: 'Prisma', icon: TechStack.Prisma },

  // Cloud & Deployment
  { name: 'Vercel', icon: TechStack.Vercel },
  { name: 'AWS', icon: TechStack.AWS },
  { name: 'Linode', icon: TechStack.Akamai },

  // Tools & Other
  { name: 'Git', icon: TechStack.Git },
  { name: 'Postman', icon: TechStack.Postman },
  { name: 'OAuth', icon: TechStack.OAuth },
  { name: 'Firebase', icon: TechStack.Firebase },
  { name: 'Docker', icon: TechStack.Docker },
  { name: 'Unity', icon: TechStack.Unity },
] as const;
