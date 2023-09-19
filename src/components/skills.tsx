'use client';

import React from 'react';
import SectionHeader from './section-header';
import { skillsData } from '@/lib/data';
import { useSectionInView } from '@/hooks/useSectionInView';

export default function Skills() {
    const { ref } = useSectionInView('Skills');

    return (
        <section
            ref={ref}
            className="mb-28 max-w-[53rem] scroll-mt-28 text-center"
            id={'Skills'}
        >
            <SectionHeader>My Skills</SectionHeader>
            <ul className="flex flex-wrap justify-center gap-2 text-lg text-gray-800">
                {skillsData.map((skill, index) => (
                    <li
                        key={index}
                        className="bg-white border borderBlack/[0.1] rounded-xl px-5 py-3 dark:bg-white/10 dark:text-white/80"
                    >
                        {skill}
                    </li>
                ))}
            </ul>
        </section>
    );
}
