import { SkillsData } from '@/models/data';

export const skillsData: SkillsData = [
  // Languages
  { name: 'Python', iconName: 'python' },
  { name: 'Java', iconName: 'java' },
  { name: 'TypeScript', iconName: 'typescript' },
  { name: 'JavaScript', iconName: 'javascript' },
  { name: 'HTML5', iconName: 'html5' },
  { name: 'CSS3', iconName: 'css3' },
  { name: 'C#', iconName: 'csharp' },
  { name: 'Swift', iconName: 'swift' },
  { name: 'Racket', iconName: 'racket' },

  // Frontend & Design
  { name: 'React', iconName: 'react' },
  { name: 'React Native', iconName: 'reactnative' },
  { name: 'Next.js', iconName: 'nextjs' },
  { name: 'Expo', iconName: 'expo' },
  { name: 'Tailwind CSS', iconName: 'tailwindcss' },
  { name: 'Redux', iconName: 'redux' },
  { name: 'Figma', iconName: 'figma' },

  // Backend & Database
  { name: 'Node.js', iconName: 'nodejs' },
  { name: 'Express', iconName: 'express' },
  { name: 'Spring Boot', iconName: 'springboot' },
  { name: 'Socket.IO', iconName: 'socketio' },
  { name: 'PostgreSQL', iconName: 'postgresql' },
  { name: 'MySQL', iconName: 'mysql' },
  { name: 'SQLite', iconName: 'sqlite' },
  { name: 'SQL Server', iconName: 'sqlserver' },
  { name: 'MongoDB', iconName: 'mongodb' },
  { name: 'Prisma', iconName: 'prisma' },

  // Cloud & Deployment
  { name: 'Vercel', iconName: 'vercel' },
  { name: 'AWS', iconName: 'aws' },
  { name: 'Linode', iconName: 'akamai' },

  // Tools & Other
  { name: 'Git', iconName: 'git' },
  { name: 'Postman', iconName: 'postman' },
  { name: 'OAuth', iconName: 'oauth' },
  { name: 'Firebase', iconName: 'firebase' },
  { name: 'Docker', iconName: 'docker' },
  { name: 'Unity', iconName: 'unity' },
] as const;
