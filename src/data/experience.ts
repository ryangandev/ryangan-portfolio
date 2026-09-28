import type { IconType } from 'react-icons';
import { FaNodeJs, FaReact, FaUnity } from 'react-icons/fa';
import { LuGraduationCap } from 'react-icons/lu';
import { SiJavascript, SiMongodb } from 'react-icons/si';
import { TbBrandReactNative } from 'react-icons/tb';

export type Experience = {
  role: string;
  organization: string;
  location: string;
  /** `YYYY-MM` */
  start: string;
  /** `YYYY-MM`, or null while it is ongoing */
  end: string | null;
  description: string;
  icon: IconType;
};

/**
 * Work and education, most recently active first. Kept in that order by hand
 * rather than sorted, since "most recent" for an overlapping co-op and degree
 * is a judgment call, not a date comparison.
 */
export const experience: Experience[] = [
  {
    role: 'Software Development Engineer',
    organization: 'Adobe',
    location: 'San Jose, CA',
    start: '2026-04',
    end: null,
    description:
      'Primary frontend contributor to a 0-to-1 conversational creation experience that brings Adobe Express into Acrobat. Built most of its UI in React and TypeScript, including designs that render as they stream in over SSE, and drove integration across the Express and Acrobat teams. Received a Bravo Award in July 2026.',
    icon: FaReact,
  },
  {
    role: 'Software Engineer',
    organization: 'Walmart (via BeaconFire)',
    location: 'Sunnyvale, CA',
    start: '2025-05',
    end: '2026-01',
    description:
      "Worked on the service behind the interactive in-store maps in Walmart's mobile apps: migrated it from Node.js 12 to 22 in one sprint, cut 2-4 seconds from every store's map, and gated its releases with Playwright. Built the internal platform that runs and rolls back map refreshes across thousands of stores.",
    icon: FaNodeJs,
  },
  {
    role: 'Full Stack Engineering Consultant',
    organization: 'BeaconFire Solution',
    location: 'East Windsor, NJ',
    start: '2024-10',
    end: '2025-05',
    description:
      'Built a full-stack HR onboarding and management platform with React, Redux Toolkit, and Node.js, including JWT authentication, role-based access control, and 30+ REST APIs. Stored sensitive employee documents in Amazon S3 alongside a MongoDB database.',
    icon: SiMongodb,
  },
  {
    role: 'Software Engineer',
    organization: 'Dynasty 11 Studios',
    location: 'Philadelphia, PA',
    start: '2022-09',
    end: '2024-05',
    description:
      "Built React and React Native features for the HelpDesk and Player 2 products, from technician dashboards to the Player 2 store. Cut the store's load time by 60% by redesigning its data models and Spring Boot APIs, and implemented cross-platform in-app purchases with RevenueCat.",
    icon: TbBrandReactNative,
  },
  {
    role: 'Bachelor of Science in Computer Science',
    organization: 'Drexel University',
    location: 'Philadelphia, PA',
    start: '2018-09',
    end: '2023-09',
    description:
      'Completed the 5-year undergraduate co-op program with concentrations in Game Development and Artificial Intelligence.',
    icon: LuGraduationCap,
  },
  {
    role: 'CMDB Engineer Co-Op',
    organization: 'Berkley Technology Services',
    location: 'Wilmington, DE',
    start: '2022-03',
    end: '2023-03',
    description:
      'Developed and optimized workflow scripts using JavaScript. Utilized SQL for database updates. Troubleshot and resolved configuration item issues. Assisted in the Probes to Pattern migration within ServiceNow.',
    icon: SiJavascript,
  },
  {
    role: 'Graphic Designer & Game Developer Co-Op',
    organization: 'Epistemitek',
    location: 'Philadelphia, PA',
    start: '2021-03',
    end: '2021-09',
    description:
      'Contributed to the development of an educational game in Unity to educate students about the human immune system. Designed new fonts for Pittman Shorthand and used Omnigraffle to structure plans and summaries for various experiments.',
    icon: FaUnity,
  },
];
