export type SocialIconName =
  | 'linkedin'
  | 'github'
  | 'discord'
  | 'medium'
  | 'email'
  | 'location'
  | 'website';

export type TechStackIconName =
  // Frontend
  | 'react'
  | 'typescript'
  | 'javascript'
  | 'html5'
  | 'css3'
  | 'nextjs'
  | 'redux'
  | 'tailwindcss'
  | 'expo'
  | 'reactnative'
  | 'swift'

  // Backend
  | 'nodejs'
  | 'express'
  | 'springboot'
  | 'socketio'
  | 'python'
  | 'java'
  | 'csharp'
  | 'racket'

  // Database
  | 'sqlite'
  | 'postgresql'
  | 'mysql'
  | 'sqlserver'
  | 'mongodb'
  | 'prisma'

  // UI/UX
  | 'figma'
  | 'adobeps'
  | 'adobeai'
  | 'mui'
  | 'antdesign'

  // Deployment
  | 'vercel'
  | 'aws'
  | 'akamai'
  | 'docker'
  | 'pm2'

  // Tools & Other
  | 'unity'
  | 'git'
  | 'postman'
  | 'oauth'
  | 'firebase'
  | 'trello';

export type SkillsData = {
  name: string;
  iconName: TechStackIconName;
}[];
