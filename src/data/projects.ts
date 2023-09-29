import { ProjectsData, TechStack } from '@/models/data';

// Player 2 Helpdesk screenshots
import p2Thumbnail from '../../public/player2-thumbnail.png';
import p2Register from '../../public/player2-register.png';
import p2Dashboard from '../../public/player2-dashboard.png';
import p2Report from '../../public/player2-report.png';

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
            'Developed for Dynasty11 Studio, the "Player 2 Helpdesk" application serves as the primary support channel for users of the "Player 2" social networking platform',
        overview: [
            'Player 2 Helpdesk is a custom web application tailored to support the "Player 2" social networking community. It facilitates efficient communication between the Player 2 app users and the support staffs.',
            'By bridging the gap between users and support staffs, it ensures efficient communication through a user-friendly dashboard, in-depth reporting, and real-time communication tools.',
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
        thumbnailUrl: p2Thumbnail,
        screenshotUrls: [p2Register, p2Dashboard, p2Report],
    },
    // {
    //     projectTitle: 'ICON',
    //     role: 'Full-Stack Developer',
    //     techUsed: [
    //         { name: 'REACT', iconType: TechStack.React },
    //         { name: 'TYPESCRIPT', iconType: TechStack.TypeScript },
    //         { name: 'ANTDESIGN', iconType: TechStack.Antdesign },
    //         { name: 'CSS3', iconType: TechStack.CSS3 },
    //         { name: 'NODE.JS', iconType: TechStack.NodeJS },
    //         { name: 'SQLITE', iconType: TechStack.SQLite },
    //         { name: 'SOCKET.IO', iconType: TechStack.SocketIO },
    //         { name: 'FIGMA', iconType: TechStack.Figma },
    //     ],
    //     context:
    //         'This project was developed as a part of a Web Development Class. It is a web-based multiplayer gaming platform.',
    //     overview: [],
    //     features: [],
    //     responsibilities: [],
    //     thumbnailUrl: p2Thumbnail,
    //     screenshotUrls: [],
    // },
] as const;
