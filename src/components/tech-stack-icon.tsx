import React from 'react';
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
  SiTrello,
  SiAdobeillustrator,
  SiCodesandbox,
} from 'react-icons/si';
import { TbBrandReactNative, TbBrandOauth } from 'react-icons/tb';

import { cn } from '@/libs/utils';
import { TechStackIconName } from '@/models/data';

type TechStackIconProps = {
  name: TechStackIconName;
  size?: number;
  className?: string;
};

const TechStackIcon: React.FC<TechStackIconProps> = ({
  name,
  size = 24,
  className,
}) => {
  switch (name) {
    case 'react':
      return (
        <FaReact
          size={size}
          className={cn('text-[#61DAFB] dark:text-[#61DAFB]', className)}
        />
      );
    case 'typescript':
      return (
        <SiTypescript size={size} className={cn('text-[#3178C6]', className)} />
      );
    case 'javascript':
      return (
        <SiJavascript size={size} className={cn('text-[#F0DB4F]', className)} />
      );
    case 'html5':
      return (
        <FaHtml5 size={size} className={cn('text-[#E34F26]', className)} />
      );
    case 'css3':
      return (
        <FaCss3Alt size={size} className={cn('text-[#2965F1]', className)} />
      );
    case 'nextjs':
      return (
        <SiNextdotjs
          size={size}
          className={cn('text-[#000000] dark:text-[#FFFFFF]', className)}
        />
      );
    case 'redux':
      return (
        <SiRedux size={size} className={cn('text-[#764ABC]', className)} />
      );
    case 'tailwindcss':
      return (
        <SiTailwindcss
          size={size}
          className={cn('text-[#06B6D4]', className)}
        />
      );
    case 'expo':
      return (
        <SiExpo
          size={size}
          className={cn('text-[#000020] dark:text-[#ffffdf]', className)}
        />
      );
    case 'reactnative':
      return (
        <TbBrandReactNative
          size={size}
          className={cn('text-[#61dafb]', className)}
        />
      );
    case 'swift':
      return (
        <SiSwift size={size} className={cn('text-[#F05138]', className)} />
      );
    case 'nodejs':
      return (
        <FaNodeJs size={size} className={cn('text-[#339933]', className)} />
      );
    case 'express':
      return (
        <SiExpress
          size={size}
          className={cn('text-[#000000] dark:text-[#ffffff]', className)}
        />
      );
    case 'springboot':
      return (
        <SiSpringboot size={size} className={cn('text-[#6DB33F]', className)} />
      );
    case 'socketio':
      return (
        <SiSocketdotio
          size={size}
          className={cn('text-[#010101] dark:text-[#fefefe]', className)}
        />
      );
    case 'python':
      return (
        <SiPython size={size} className={cn('text-[#3776AB]', className)} />
      );
    case 'java':
      return <FaJava size={size} className={cn('text-[#007396]', className)} />;
    case 'csharp':
      return (
        <SiCsharp size={size} className={cn('text-[#239120]', className)} />
      );
    case 'racket':
      return (
        <SiRacket size={size} className={cn('text-[#9F1D20]', className)} />
      );
    case 'sqlite':
      return (
        <SiSqlite size={size} className={cn('text-[#003B57]', className)} />
      );
    case 'postgresql':
      return (
        <SiPostgresql size={size} className={cn('text-[#4169E1]', className)} />
      );
    case 'mysql':
      return (
        <SiMysql size={size} className={cn('text-[#4479A1]', className)} />
      );
    case 'sqlserver':
      return (
        <SiMicrosoftsqlserver
          size={size}
          className={cn('text-[#CC2927]', className)}
        />
      );
    case 'mongodb':
      return (
        <SiMongodb size={size} className={cn('text-[#47A248]', className)} />
      );
    case 'prisma':
      return (
        <SiPrisma
          size={size}
          className={cn('text-[#1B222D] dark:text-[#e4ddd2]', className)}
        />
      );
    case 'figma':
      return (
        <FaFigma size={size} className={cn('text-[#F24E1E]', className)} />
      );
    case 'adobeps':
      return (
        <SiAdobephotoshop
          size={size}
          className={cn('text-[#FF0000]', className)}
        />
      );
    case 'adobeai':
      return (
        <SiAdobeillustrator
          size={size}
          className={cn('text-[#FF9A00]', className)}
        />
      );
    case 'mui':
      return <SiMui size={size} className={cn('text-[#0081CB]', className)} />;
    case 'antdesign':
      return (
        <SiAntdesign size={size} className={cn('text-[#1890FF]', className)} />
      );
    case 'vercel':
      return (
        <SiVercel
          size={size}
          className={cn('text-[#000000] dark:text-[#FFFFFF]', className)}
        />
      );
    case 'aws':
      return <FaAws size={size} className={cn('text-[#FF9900]', className)} />;
    case 'akamai':
      return (
        <SiAkamai size={size} className={cn('text-[#0096D6]', className)} />
      );
    case 'docker':
      return (
        <FaDocker size={size} className={cn('text-[#2496ED]', className)} />
      );
    case 'pm2':
      return <SiPm2 size={size} className={cn('text-[#2B037A]', className)} />;
    case 'unity':
      return (
        <FaUnity
          size={size}
          className={cn('text-[#000000] dark:text-[#ffffff]', className)}
        />
      );
    case 'git':
      return <SiGit size={size} className={cn('text-[#F05032]', className)} />;
    case 'postman':
      return (
        <SiPostman size={size} className={cn('text-[#FF6C37]', className)} />
      );
    case 'oauth':
      return (
        <TbBrandOauth
          size={size}
          className={cn('text-[#000000] dark:text-[#ffffff]', className)}
        />
      );
    case 'firebase':
      return (
        <SiFirebase size={size} className={cn('text-[#FFCA28]', className)} />
      );
    case 'trello':
      return (
        <SiTrello
          size={size}
          className={cn('text-[#0052CC] dark:text-[#0079BF]', className)}
        />
      );
    default:
      return (
        <SiCodesandbox
          size={size}
          className={cn('text-slate-900 dark:text-slate-800', className)}
        />
      );
  }
};

export default TechStackIcon;
