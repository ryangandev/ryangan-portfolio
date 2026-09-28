import type { IconType } from 'react-icons';
import { FaReact, FaUnity } from 'react-icons/fa';
import { LuGraduationCap } from 'react-icons/lu';
import { SiJavascript } from 'react-icons/si';

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
    role: 'Frontend Developer',
    organization: 'Dynasty11 Studio',
    location: 'Philadelphia, PA',
    start: '2022-09',
    end: null,
    description:
      'Implemented the store section of the "Player 2" app, focusing on UI, application flow, and the representation of cosmetic items. Integrated RevenueCat to manage in-app purchases, ensuring cross-platform compatibility. Troubleshot and resolved bugs of the app in production.',
    icon: FaReact,
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
