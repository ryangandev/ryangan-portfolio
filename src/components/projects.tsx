'use client';

import React from 'react';
import SectionHeader from './section-header';
import { projectsData } from '@/lib/data';
import Project from './project';
import { useSectionInView } from '@/hooks/useSectionInView';

export default function Projects() {
    const { ref } = useSectionInView('Projects', 0.5);

    return (
        <section ref={ref} id="projects" className="scroll-mt-28 mb-28">
            <SectionHeader>My Projects</SectionHeader>
            <div>
                {projectsData.map((project, index) => (
                    <Project key={index} {...project} />
                ))}
            </div>
        </section>
    );
}