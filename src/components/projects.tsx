import React from 'react';
import SectionHeader from './section-header';
import { projectsData } from '@/lib/data';
import Project from './project';

export default function Projects() {
    return (
        <section id="projects" className="scroll-mt-28 mb-28">
            <SectionHeader>My Projects</SectionHeader>
            <div>
                {projectsData.map((project, index) => (
                    <Project key={index} {...project} />
                ))}
            </div>
        </section>
    );
}
