import type { StaticImageData } from 'next/image';
import type { IconType } from 'react-icons';
import { FaUnity } from 'react-icons/fa';

import adobe from '@/assets/logos/adobe.svg';
import beaconfire from '@/assets/logos/beaconfire.svg';
import berkley from '@/assets/logos/berkley.svg';
import drexel from '@/assets/logos/drexel.svg';
import dynasty11 from '@/assets/logos/dynasty11.svg';
import walmart from '@/assets/logos/walmart.svg';

export type Experience = {
  role: string;
  organization: string;
  location: string;
  /** `YYYY-MM` */
  start: string;
  /** `YYYY-MM`, or null while it is ongoing */
  end: string | null;
  description: string;
  /**
   * The organization's logo, from `src/assets/logos`, or an icon standing in
   * for one that has no public logo
   */
  mark: StaticImageData | IconType;
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
      'On the Acrobat Web team, currently bringing the Adobe Express experience into Acrobat.',
    mark: adobe,
  },
  {
    role: 'Software Engineer',
    organization: 'Walmart (via BeaconFire)',
    location: 'Sunnyvale, CA',
    start: '2025-05',
    end: '2026-01',
    description:
      'Contributed to the store maps team, whose interactive maps cover 9,000 Walmart stores. Migrated the map service from Node.js 12 to 22, and worked on the internal platform that refreshes the maps.',
    mark: walmart,
  },
  {
    role: 'Full Stack Engineering Consultant',
    organization: 'BeaconFire Solution',
    location: 'East Windsor, NJ',
    start: '2024-10',
    end: '2025-05',
    description: 'Built a full-stack HR onboarding and management platform.',
    mark: beaconfire,
  },
  {
    role: 'Software Engineer',
    organization: 'Dynasty 11 Studios',
    location: 'Philadelphia, PA',
    start: '2022-09',
    end: '2024-05',
    description:
      'Built the store for Player 2, a mobile social networking app for gamers, enabling in-app purchases through RevenueCat. Also built the frontend of HelpDesk, a web app where users submit tickets and technicians track them.',
    mark: dynasty11,
  },
  {
    role: 'Bachelor of Science in Computer Science',
    organization: 'Drexel University',
    location: 'Philadelphia, PA',
    start: '2018-09',
    end: '2023-09',
    description:
      'Completed the 5-year undergraduate co-op program with concentrations in Game Development and Artificial Intelligence.',
    mark: drexel,
  },
  {
    role: 'CMDB Engineer Co-Op',
    organization: 'Berkley Technology Services',
    location: 'Wilmington, DE',
    start: '2022-03',
    end: '2023-03',
    description:
      "Optimized ServiceNow workflows with JavaScript and wrote SQL views over the CMDB's data. Also worked on the migration from probes to patterns in ServiceNow.",
    mark: berkley,
  },
  {
    role: 'Unity Developer Co-Op',
    organization: 'Epistemitek',
    location: 'Philadelphia, PA',
    start: '2021-03',
    end: '2021-09',
    description:
      'Contributed to an educational game in Unity that teaches students about the human immune system.',
    mark: FaUnity,
  },
];
