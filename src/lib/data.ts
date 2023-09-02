import React from 'react';
import { CgWorkAlt } from 'react-icons/cg';
import { FaReact } from 'react-icons/fa';
import { LuGraduationCap } from 'react-icons/lu';
import corpcommentImg from '../../public/corpcomment.png';
import rmtdevImg from '../../public/rmtdev.png';
import wordanalyticsImg from '../../public/wordanalytics.png';

export const links = [
    {
        name: 'Home',
        hash: '#home',
    },
    {
        name: 'About',
        hash: '#about',
    },
    {
        name: 'Projects',
        hash: '#projects',
    },
    {
        name: 'Skills',
        hash: '#skills',
    },
    {
        name: 'Experience',
        hash: '#experience',
    },
    {
        name: 'Contact',
        hash: '#contact',
    },
] as const;

// TODO: modify these later
export const experiencesData = [
    {
        title: 'Graphic Designer & Game Develeoper Co-Op',
        location: 'Philadelphia, PA',
        description:
            'I worked as a graphic designer and game developer co-op for 1 year. I designed logos, business cards, flyers, and more. I also developed games in Unity.',
        icon: React.createElement(LuGraduationCap),
        date: '2019',
    },
    {
        title: 'CMDB Enginner Co-Op',
        location: 'Wilmington, DE',
        description:
            'I worked as a CMDB engineer co-op for 1 year. I developed a CMDB web app in React and Node.js. I also worked on a data migration project in Python.',
        icon: React.createElement(CgWorkAlt),
        date: '2019 - 2021',
    },
    {
        title: 'Frontend Developer',
        location: 'Philadelphia, PA',
        description:
            'I worked for Dynasty11 Studio as a frontend developer for 1 year. I developed a web app in React and Next.js. I also worked on a data migration project in Python.',
        icon: React.createElement(FaReact),
        date: '2021 - present',
    },
] as const;

// TODO: modify these later
export const projectsData = [
    {
        title: 'ICON',
        description:
            'I worked as a full-stack developer for ICON. It is a web mini games platform. I developed the front-end and back-end. It has features like authentication, payment, and more.',
        tags: [
            'React',
            'TypeScript',
            'CSS3',
            'NodeJS',
            'SQLite',
            'SocketIO',
            'Figma',
        ],
        imageUrl: corpcommentImg,
    },
    {
        title: 'Player 2 Helpdesk',
        description:
            'I worked as a frontend developer creating a Helpdesk application for Player 2 users to submit tickets and get help from the Player 2 team.',
        tags: [
            'React',
            'TypeScript',
            'TailwindCSS',
            'Redux',
            'SpringBoot',
            'PostgreSQL',
            'Figma',
        ],
        imageUrl: rmtdevImg,
    },
    {
        title: 'Photo Gallery',
        description:
            'I worked as a full-stack developer creating a Photo Gallery web app. It is a web app for users to upload and share photos.',
        tags: ['React', 'NextJS', 'PostgreSQL', 'TailwindCSS', 'TypeScript'],
        imageUrl: wordanalyticsImg,
    },
] as const;

// TODO: modify these later, use icons instead of text
export const skillsData = [
    'HTML',
    'CSS',
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Git',
    'Tailwind',
    'Prisma',
    'MongoDB',
    'Redux',
    'GraphQL',
    'Apollo',
    'Express',
    'PostgreSQL',
    'Python',
    'Django',
    'Framer Motion',
] as const;
