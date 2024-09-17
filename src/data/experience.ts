import React from 'react';
import { FaReact, FaUnity } from 'react-icons/fa';
import { SiJavascript } from 'react-icons/si';
import { LuGraduationCap } from 'react-icons/lu';

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
