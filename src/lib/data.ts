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
        projectTitle: 'ICON - Multiplayer Gaming Platform',
        role: 'Full-Stack Developer',
        // description:
        //     'I worked as a full-stack developer for ICON. It is a web mini games platform. I developed the front-end and back-end. It has features like authentication, payment, and more.',
        description:
            'A web-based multiplayer gaming platform that features a range of games, including Tic-Tac-Toe, Minesweeper, Draw and Guess. More are on the way!',
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
        projectTitle: 'Player 2 Helpdesk',
        role: 'Frontend Developer',
        description:
            'A tailored application designed for the "Player 2" social networking platform. It allows users to submit tickets and receive assistance directly from the Player 2 team.',
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
