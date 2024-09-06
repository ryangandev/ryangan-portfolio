'use client';

import React from 'react';
import SectionHeader from './section-header';
import TechStackIcon from '@/components/tech-stack-icon';
import { skillsData } from '@/data/skills';
import { useSectionInView } from '@/hooks/useSectionInView';
import { motion } from 'framer-motion';
import { TechStackIconName } from '@/models/data';
import { useTheme } from 'next-themes';

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
    },
  }),
};

export default function Skills() {
  const { ref } = useSectionInView('Skills', 0.5);
  const { theme } = useTheme();

  const renderTechStackIcon = (name: TechStackIconName) => (
    <TechStackIcon name={name} />
  );

  return (
    <section
      ref={ref}
      className="mb-28 max-w-[53rem] scroll-mt-28 text-center"
      id={'skills'}
    >
      <SectionHeader section="Skills" />
      <ul className="flex flex-wrap justify-center gap-2 text-lg text-gray-800 sm:gap-4">
        {skillsData.map((skill, index) => (
          <motion.li
            key={index}
            className="borderBlack flex flex-row items-center justify-center gap-2 rounded-xl bg-white px-3 py-1.5 capitalize shadow-md dark:bg-white/10 dark:text-white/80"
            variants={fadeInAnimationVariants}
            initial={'initial'}
            whileInView={'animate'}
            viewport={{
              once: true,
            }}
            custom={index}
          >
            {renderTechStackIcon(skill.iconName as TechStackIconName)}
            {skill.name}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
