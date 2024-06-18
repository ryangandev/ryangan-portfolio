'use client';

import React, { ReactElement } from 'react';
import SectionHeader from './section-header';
import { useSectionInView } from '@/hooks/useSectionInView';

import { experiencesData } from '@/data/experience';
import { useTheme } from 'next-themes';

interface ResizeableIconProps {
  IconComponent: ReactElement;
}

export default function Experience() {
  const { ref, inView } = useSectionInView('Experience', 0.4);
  const { theme } = useTheme();

  // Temporary solution to create a resizable icon to control the size of the Icon, inline style fontSize doesn't work.
  const ResizableIcon = ({ IconComponent }: ResizeableIconProps) => {
    return <div className="md:scale-125">{IconComponent}</div>;
  };

  return (
    <section ref={ref} className="mb-28 scroll-mt-28" id="experience">
      <SectionHeader>Experience</SectionHeader>

      {experiencesData.map((item, index) => (
        <React.Fragment key={index}></React.Fragment>
      ))}
    </section>
  );
}
