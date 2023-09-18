'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BsArrowRight } from 'react-icons/bs';
import { HiDownload } from 'react-icons/hi';
import { SocialMediaIcon } from '@/assets/icons/index';
import { SocialMedia } from '@/models/icon';

export default function Intro() {
    return (
        <section className="mb-28 max-w-[50rem] text-center">
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
                            src="https://cdn.discordapp.com/attachments/1095855762103865454/1095855782551105556/IMG_4427.JPG"
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
                <p>
                    <span className="font-bold text-3xl sm:text-4xl">
                        Hello, I&apos;m Ryan Gan.{' '}
                    </span>
                </p>
                <p>
                    I&apos;m a
                    <span className="font-bold"> full-stack developer</span>.
                </p>
                <p>
                    I enjoy building
                    <span className="italic"> web & mobile applications</span>.
                </p>
            </motion.h1>

            <motion.div
                className="flex flex-col items-center justify-center gap-4 px-4 text-lg font-medium"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.1,
                }}
            >
                {/* <div className="flex flex-row gap-4">
                    <Link
                        href="contact"
                        className="group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition"
                    >
                        Contact me
                        <BsArrowRight className="opacity-70 group-hover:translate-x-1 transition" />
                    </Link>
                    <a
                        className="group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
                        href="/Rg_resume_v2.01.pdf"
                        download
                    >
                        Download CV
                        <HiDownload className="opacity-60 group-hover:translate-y-1 transition" />
                    </a>
                </div> */}

                <div className="flex flex-row gap-4">
                    <a
                        className="bg-white p-3 flex items-center text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
                        href="#contact"
                        // target="_blank"
                    >
                        <SocialMediaIcon type={SocialMedia.Email} />
                    </a>
                    <a
                        className="bg-white p-3 flex items-center text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
                        href="https://github.com/ryangan516"
                        target="_blank"
                    >
                        <SocialMediaIcon type={SocialMedia.GitHub} />
                    </a>
                    <a
                        className="bg-white p-3 flex items-center text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
                        href="https://www.linkedin.com/in/ryangan1/"
                        target="_blank"
                    >
                        <SocialMediaIcon type={SocialMedia.LinkedIn} />
                    </a>
                </div>
            </motion.div>
        </section>
    );
}
