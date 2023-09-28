import React from 'react';
import { FaReact, FaUnity } from 'react-icons/fa';
import { SiJavascript } from 'react-icons/si';
import { LuGraduationCap } from 'react-icons/lu';
import rmtdevImg from '../../public/rmtdev.png';
import { TechStack, IconsData, ProjectsData } from '@/models/data';

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

export const experiencesData = [
    {
        title: 'Graphic Designer & Game Develeoper Co-Op',
        company: 'Epistemitek',
        location: 'Philadelphia, PA',
        description:
            'Contributed to the development of an educational game in Unity to educate students about the human immune system. Designed new fonts for Pittman Shorthand and used Omnigraffle to structure plans and summaries for various experiments.',
        icon: React.createElement(FaUnity),
        date: 'March 2021 - September 2021',
    },
    {
        title: 'CMDB Enginner Co-Op',
        company: 'Berkley Technology Services',
        location: 'Wilmington, DE',
        description:
            'Developed and optimized workflow scripts using JavaScript. Utilized SQL for database updates. Troubleshot and resolved configuration item issues. Assisted in the Probes to Pattern migration within ServiceNow.',
        icon: React.createElement(SiJavascript),
        date: 'March 2022 - March 2023',
    },
    {
        title: 'Bachelor of Science in Computer Science',
        company: 'Drexel University',
        location: 'Philadelphia, PA',
        description:
            'On September 7, 2023, I completed my 5-Year Undergraduate Co-Op program, graduating with a Bachelor of Science in Computer Science as well as concentrations in Game Development and Artificial Intelligence.',
        icon: React.createElement(LuGraduationCap),
        date: 'September 2018 - September 2023',
    },
    {
        title: 'Frontend Developer',
        company: 'Dynasty11 Studio',
        location: 'Philadelphia, PA',
        description:
            'Implemented the store section of the "Player 2" app, focusing on UI, application flow, and the representation of cosmetic items. Integrated RevenueCat to manage in-app purchases, ensuring cross-platform compatibility. Troubleshot and resolved bugs of the app in production.',
        icon: React.createElement(FaReact),
        date: 'September 2022 - present',
    },
] as const;

export const projectsData: ProjectsData = [
    {
        projectTitle: 'Player 2 Helpdesk',
        role: 'Frontend Developer',
        techUsed: [
            { name: 'REACT', iconType: TechStack.React },
            { name: 'TYPESCRIPT', iconType: TechStack.TypeScript },
            { name: 'TAILWINDCSS', iconType: TechStack.TailwindCSS },
            { name: 'MUI', iconType: TechStack.MUI },
            { name: 'REDUX', iconType: TechStack.Redux },
            { name: 'SPRINGBOOT', iconType: TechStack.SpringBoot },
            { name: 'POSTGRESQL', iconType: TechStack.PostgreSQL },
            { name: 'FIGMA', iconType: TechStack.Figma },
        ],
        context:
            '💁 Developed for Dynasty11 Studio, the "Player 2 Helpdesk" application serves as the primary support channel for users of the "Player 2" social networking platform',
        overview: [
            'Player 2 Helpdesk is a custom web application tailored to support the "Player 2" social networking community. It facilitates efficient communication between the Player 2 app users and the support staff.',
            'By bridging the gap between users and support staff, it ensures efficient communication through a user-friendly dashboard, in-depth reporting, and real-time communication tools.',
        ],
        features: [
            {
                title: 'Comprehensive Dashboard',
                detail: 'Empowers the Player 2 support team with advanced filtering and sorting capabilities for efficient ticket management',
            },
            {
                title: 'Dynamic Reporting System',
                detail: 'Provides in-depth insights into helpdesk performance using a range of data visualizations',
            },
            {
                title: 'Real-time Communication',
                detail: 'Facilitates seamless chats and notifications, enabling instant interactions between users and support',
            },
        ],
        responsibilities: [
            'Led the frontend team from conceptualizing the UI in **Figma** to translating the design into a fully functional implementation using **React** and **TypeScript**',
            'Designed a user-friendly **dashboard** component with advanced filtering and sorting capabilities, ensuring efficient ticket management for the support team',
            'Developed a dynamic **reporting system** that supports diverse date range and filter selections, utilizing **Rechart**, to offer insights into helpdesk performance',
            'Collaborated closely with the backend team to harness **server-sent events**, enabling real-time chat and notification features',
            'Configured and managed application state using **Redux** to ensure state consistency across various functionalities',
        ],
        thumbnailUrl: '',
        screenshotUrls: [],
    },
    {
        projectTitle: 'ICON',
        role: 'Full-Stack Developer',
        techUsed: [
            { name: 'REACT', iconType: TechStack.React },
            { name: 'TYPESCRIPT', iconType: TechStack.TypeScript },
            { name: 'ANTDESIGN', iconType: TechStack.Antdesign },
            { name: 'CSS3', iconType: TechStack.CSS3 },
            { name: 'NODE.JS', iconType: TechStack.NodeJS },
            { name: 'SQLITE', iconType: TechStack.SQLite },
            { name: 'SOCKET.IO', iconType: TechStack.SocketIO },
            { name: 'FIGMA', iconType: TechStack.Figma },
        ],
        context:
            '🎮 This project was developed as a part of a Web Development Class. It is a web-based multiplayer gaming platform.',
        overview: [],
        features: [],
        responsibilities: [],
        thumbnailUrl: '',
        screenshotUrls: [],
    },
] as const;

export const skillsData: IconsData = [
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
