'use client';

import { useState } from 'react';

import ProjectPreview from '@/components/portfolio/project-preview';
import Search from '@/components/search';
import { ProjectMetadata } from '@/models/project';

type ProjectListProps = {
  projects: ProjectMetadata[];
};

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <section>
      <Search
        placeholder="Search for projects..."
        setSearchTerm={setSearchTerm}
      />
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects
          .filter(
            (project) =>
              project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              project.summary.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .map((project) => (
            <ProjectPreview
              key={project.slug}
              project={project}
              searchTerm={searchTerm}
            />
          ))}
      </div>
    </section>
  );
};

export default ProjectList;
