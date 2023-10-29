import { ProjectsData, TechStack } from '@/models/data';

// Player 2 Helpdesk screenshots
import p2Thumbnail from '../../public/player2-thumbnail.png';
import p2Register from '../../public/player2-register.png';
import p2Dashboard from '../../public/player2-dashboard.png';
import p2Report from '../../public/player2-report.png';

// Icon.io screenshots
import iconLanding from '../../public/icon.io-screenshots/icon.io-landing.png';
import iconGamehub from '../../public/icon.io-screenshots/icon.io-gamehub.png';
import iconLobby from '../../public/icon.io-screenshots/icon.io-draw-and-guess-lobby.png';
import iconWordSelect from '../../public/icon.io-screenshots/icon.io-draw-and-guess-word-select.png';
import iconDraw from '../../public/icon.io-screenshots/icon.io-draw-and-guess-draw.png';
import iconGuessed from '../../public/icon.io-screenshots/icon.io-draw-and-guess-guessed.png';
import iconReview from '../../public/icon.io-screenshots/icon.io-draw-and-guess-review.png';

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
    {
        projectTitle: 'Icon.io',
        role: 'Full-Stack Developer',
        techUsed: [
            { name: 'REACT', iconType: TechStack.React },
            { name: 'NODE.JS', iconType: TechStack.NodeJS },
            { name: 'SOCKET.IO', iconType: TechStack.SocketIO },
            { name: 'TYPESCRIPT', iconType: TechStack.TypeScript },
            { name: 'AWS', iconType: TechStack.AWS },
            { name: 'ANTDESIGN', iconType: TechStack.Antdesign },
            { name: 'CSS3', iconType: TechStack.CSS3 },
            { name: 'FIGMA', iconType: TechStack.Figma },
        ],
        context:
            'Developed as part of a Web Development course, "Icon.io" is a dynamic online multiplayer platform aiming to deliver a fun and interactive gaming experience for you and your friends!',
        overview: [
            'Icon.io is a dynamic web-based, online multiplayer gaming platform developed using React, Node.js TypeScript and it utilizes Socket.IO to provide real-time user interactivity.',
            'It currently hosts the multiplayer game Draw & Guess, providing a canvas for you and your friends to showcase creativity and artistic skills while enjoying a fun gaming experience.',
            'Plans are underway to introduce more games soon, such as the classic Tic-Tac-Toe and multiplayer Minesweeper.',
        ],
        features: [
            {
                title: 'Comprehensive Room Management',
                detail: 'Offers a robust room management system, enabling users to create, join, and leave rooms with ease, while also supporting public and private room configurations',
            },
            {
                title: 'Real-Time Interactivity',
                detail: 'Facilitates real-time chat and lobby updates, dynamically reflecting player activity and room information',
            },
            {
                title: 'Mature Gameplay Mechanism',
                detail: 'Ensures a well-structured game loop for seamless turn-taking logic and a scoring mechanism based on correct guesses in every Draw and Guess game session',
            },
            {
                title: 'Synchronized Canvas Broadcasting',
                detail: 'Provides a dynamic whiteboard component with various colors and brush sizes, while broadcasting the drawing in real-time to all players in the room',
            },
        ],
        responsibilities: [
            'Designed an intuitive and user-friendly UI/UX for the application using **Figma**, and translated the design into a functional frontend using **React** and **TypeScript** with **Ant Design** components',
            'Engineered the backend using **Node.js**, with robust **socket event emitters and listeners** to support **room management**, as well as the **gameplay logic** and architecture',
            'Implemented the **whiteboard** component using the **Canvas API** and **Socket.IO** to ensure synchronized broadcasting of drawings in real-time',
            'Configured and deployed the application on **AWS EC2** and utilized the process manager **PM2** to ensure continuous uptime and availability',
        ],
        thumbnailUrl: p2Thumbnail,
        screenshotUrls: [
            iconLanding,
            iconGamehub,
            iconLobby,
            iconWordSelect,
            iconDraw,
            iconGuessed,
            iconReview,
        ],
    },
] as const;
