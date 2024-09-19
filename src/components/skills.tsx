'use client';

import React from 'react';
import { motion } from 'framer-motion';

import TechStackIcon from '@/components/icons/tech-stack-icon';
import { skillsData } from '@/data/skills';
import { useSectionInView } from '@/hooks/useSectionInView';
import { TechStackIconName } from '@/models/data';

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

  const renderTechStackIcon = (name: TechStackIconName) => (
    <TechStackIcon name={name} size={18} />
  );

  return (
    <section ref={ref} className="scroll-mt-28 text-center" id={'skills'}>
      <h2>Skills</h2>
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
