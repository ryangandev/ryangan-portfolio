'use client';

import React, { ReactElement } from 'react';
import SectionHeader from './section-header';
import { useSectionInView } from '@/hooks/useSectionInView';
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { experiencesData } from '@/lib/data';
import { useTheme } from '@/hooks/useTheme';

interface ResizeableIconProps {
    IconComponent: ReactElement;
}

export default function Experience() {
    const { ref } = useSectionInView('Experience', 0.4);
    const { theme } = useTheme();

    // Temporary solution to create a resizable icon to control the size of the Icon, inline style fontSize doesn't work.
    const ResizableIcon = ({ IconComponent }: ResizeableIconProps) => {
        return <div className="md:scale-125">{IconComponent}</div>;
    };

    return (
        <section ref={ref} className="scroll-mt-28 mb-28" id="experience">
            <SectionHeader>Experience</SectionHeader>
            <VerticalTimeline lineColor="">
                {experiencesData.map((item, index) => (
                    <React.Fragment key={index}>
                        <VerticalTimelineElement
                            contentStyle={{
                                background:
                                    theme === 'light'
                                        ? '#f3f4f6'
                                        : 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(0, 0, 0, 0.05)',
                                textAlign: 'left',
                                padding: '1.3rem 2rem',
                            }}
                            contentArrowStyle={{
                                borderRight: '0.4rem solid #9ca3af',
                            }}
                            date={item.date}
                            icon={<ResizableIcon IconComponent={item.icon} />}
                            iconStyle={{
                                background:
                                    theme === 'light'
                                        ? 'rgb(241 245 249)'
                                        : 'rgb(30 41 59)',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <h3 className="text-lg !font-semibold capitalize">
                                {item.title}
                            </h3>
                            <div className="flex flex-row font-[500] mt-1/2">
                                <span className="mr-2 italic">
                                    {item.company}
                                </span>
                                |<span className="ml-2">{item.location}</span>
                            </div>

                            <p className="!mt-2 !font-normal descriptionFontColor">
                                {item.description}
                            </p>
                        </VerticalTimelineElement>
                    </React.Fragment>
                ))}
            </VerticalTimeline>
        </section>
    );
}
