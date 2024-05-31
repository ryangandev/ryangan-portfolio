'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AiOutlineDoubleRight } from 'react-icons/ai';
import { SocialMediaIcon } from '@/assets/icons/index';
import { SocialMedia } from '@/models/data';
import { useSectionInView } from '@/hooks/useSectionInView';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useTheme } from '@/hooks/useTheme';
import Typewriter from './typewriter';

export default function Intro() {
    const { ref } = useSectionInView('Home', 0.5);
    const { setActiveSection, setTimeOfLastClick } = useActiveSection();
    const { theme } = useTheme();

    return (
        <section
            ref={ref}
            id="home"
            className="mb-28 max-w-[50rem] text-center scroll-mt-28"
        >
            <div className="flex items-center justify-center">
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            type: 'tween',
                            duration: 0.25,
                            delay: 0.5,
                        }}
                    >
                        <Image
                            src="https://cdn.discordapp.com/attachments/883897355445895188/1236868626120966144/IMG_4427.JPG?ex=6639932c&is=663841ac&hm=d66c03017d23116b480141e1193fcae6db8d353b6b3a139d97edb65c8a13e439&"
                            alt="Ryan Gan"
                            width={200}
                            height={200}
                            quality={95}
                            priority={true}
                            className="h-28 w-28 rounded-full object-cover border-[0.25rem] border-white shadow-xl"
                        />
                    </motion.div>

                    <motion.span
                        // TODO: Later add hand wave animation when clicked
                        className="absolute bottom-0 right-0 text-4xl cursor-pointer"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            type: 'spring',
                            stiffness: 125,
                            delay: 0.75,
                            duration: 0.7,
                        }}
                    >
                        👋
                    </motion.span>
                </div>
            </div>

            <motion.h1
                className="my-10 px-4 text-2xl leading-[1.7] font-mono"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    type: 'tween',
                    duration: 0.5,
                    delay: 1,
                }}
            >
                <Typewriter
                    text="Hello, I'm Ryan Gan."
                    delay={100}
                    startDelay={1500}
                    showCursor={true}
                />
                <p>
                    I&apos;m a
                    <span className="font-bold"> software enginner</span>.
                </p>
                <p>
                    I enjoy building
                    <span className="italic"> web & mobile applications</span>.
                </p>
            </motion.h1>

            <motion.div
                className="flex flex-col items-center justify-center gap-4 px-4 text-lg font-medium sm:flex-row"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.1,
                }}
            >
                <div className="flex flex-row gap-4">
                    <a
                        className="bg-white p-3 flex items-center text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
                        href="#contact"
                        onClick={() => {
                            setActiveSection('Contact');
                            setTimeOfLastClick(Date.now());
                        }}
                    >
                        <SocialMediaIcon type={SocialMedia.Email} />
                    </a>
                    <a
                        className="bg-white p-3 flex items-center text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
                        href="https://github.com/ryangandev"
                        target="_blank"
                    >
                        <SocialMediaIcon
                            type={SocialMedia.GitHub}
                            isDarkMode={theme === 'dark'}
                        />
                    </a>
                    <a
                        className="bg-white p-3 flex items-center text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
                        href="https://www.linkedin.com/in/ryangan1/"
                        target="_blank"
                    >
                        <SocialMediaIcon type={SocialMedia.LinkedIn} />
                    </a>
                </div>
                <a
                    className="group bg-white text-base px-4 py-2 flex items-center gap-1 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
                    href="/Rg_resume_v3.0.2.pdf"
                    target="_blank"
                >
                    View Résumé
                    <AiOutlineDoubleRight className="opacity-60 group-hover:translate-x-1.5 transition" />
                </a>
            </motion.div>
        </section>
    );
}
