'use client';

import React from 'react';
import SectionHeader from './section-header';
import { skillsData } from '@/lib/data';
import { useSectionInView } from '@/hooks/useSectionInView';
import { motion } from 'framer-motion';
import { TechStack } from '@/models/data';
import { TechStackIcon } from '@/assets/icons';

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

    const renderTechStackIcon = (type: TechStack) => (
        <TechStackIcon type={type} />
    );

    return (
        <section
            ref={ref}
            className="mb-28 max-w-[53rem] scroll-mt-28 text-center"
            id={'skills'}
        >
            <SectionHeader>Skills</SectionHeader>
            <ul className="flex flex-wrap justify-center gap-2 text-lg text-gray-800">
                {skillsData.map((skill, index) => (
                    <motion.li
                        key={index}
                        className="flex flex-row items-center justify-center gap-2 bg-white borderBlack rounded-xl px-4 py-2 dark:bg-white/10 dark:text-white/80"
                        variants={fadeInAnimationVariants}
                        initial={'initial'}
                        whileInView={'animate'}
                        viewport={{
                            once: true,
                        }}
                        custom={index}
                    >
                        {renderTechStackIcon(skill.iconType as TechStack)}
                        {skill.name}
                    </motion.li>
                ))}
            </ul>
        </section>
    );
}
