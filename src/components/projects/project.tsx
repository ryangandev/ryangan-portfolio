'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TechStackIcon } from '@/assets/icons';
import { TechStack, Project } from '@/models/data';
import { useDisclosure } from '@nextui-org/react';
import ProjectModal from './project-modal';
import { useNavbar } from '@/hooks/useNavbar';
import { useTheme } from '@/hooks/useTheme';

export default function Project(props: Project) {
    const { projectTitle, techUsed, context, thumbnailUrl } = props;
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['0 1', '1.33 1'],
    });
    const scaleProgress = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const opacityProgress = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { setNavbarVisible } = useNavbar();
    const { theme } = useTheme();

    return (
        <motion.div
            ref={ref}
            style={{
                scale: scaleProgress,
                opacity: opacityProgress,
            }}
            className="group mb-3 sm:mb-8 last:mb-0 cursor-pointer"
            onClick={() => {
                onOpen();
                setNavbarVisible(false);
            }}
        >
            <section className="bg-gray-100 max-w-[42rem] border border-black/5 rounded-lg overflow-hidden shadow-md sm:pr-8 relative sm:h-[20rem] hover:bg-gray-200 transition sm:group-even:pl-8 sm:group-even:pr-0 highlightedFontColor dark:bg-white/10 dark:hover:bg-white/20">
                <div className="pt-4 pb-4 px-5 sm:pl-10 sm:pr-2 sm:pt-10 sm:pb-10 sm:max-w-[50%] flex flex-col h-full sm:group-even:ml-[18rem]">
                    <h3 className="text-2xl font-semibold">{projectTitle}</h3>
                    <p className="mt-2 leading-relaxed text-gray-700 dark:text-white/70">
                        {context}
                    </p>
                    <ul className="flex flex-wrap mt-4 gap-3 sm:mt-auto">
                        {techUsed.map((tech, index) => (
                            <li className="text-lg" key={index}>
                                <TechStackIcon
                                    type={tech.icon as TechStack}
                                    isDarkMode={theme === 'dark'}
                                />
                            </li>
                        ))}
                    </ul>
                </div>

                <Image
                    src={thumbnailUrl}
                    alt={'Project I worked on'}
                    quality={95}
                    placeholder="blur"
                    className="absolute hidden sm:block top-12 -right-40 w-[28.25rem] rounded-t-lg shadow-2xl
                                transition 
                                group-hover:scale-[1.04]
                                group-hover:-translate-x-10
                                group-hover:translate-y-3
                                group-hover:-rotate-2

                                group-even:group-hover:translate-x-10
                                group-even:group-hover:translate-y-3
                                group-even:group-hover:rotate-2

                                group-even:right-[initial] group-even:-left-40"
                />
            </section>
            <ProjectModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                {...props}
            />
        </motion.div>
    );
}
