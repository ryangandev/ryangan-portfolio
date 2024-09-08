'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { AiOutlineDoubleRight } from 'react-icons/ai';

import SocialIcon from '@/components/icons/social-icon';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useSectionInView } from '@/hooks/useSectionInView';
import Typewriter from './typewriter';

export default function Intro() {
  const { ref } = useSectionInView('Home', 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSection();

  return (
    <section
      ref={ref}
      id="home"
      className="mb-28 max-w-[50rem] scroll-mt-28 text-center"
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
              src="https://ik.imagekit.io/ryangan/profile-icon.jpeg?updatedAt=1718985313938"
              alt="Ryan Gan"
              width={200}
              height={200}
              quality={95}
              priority={true}
              className="h-28 w-28 rounded-full border-[0.25rem] border-white object-cover shadow-xl"
            />
          </motion.div>

          <motion.span
            // TODO: Later add hand wave animation when clicked
            className="absolute bottom-0 right-0 cursor-pointer text-4xl"
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
        className="my-10 px-4 font-mono text-2xl leading-[1.7]"
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
          I&apos;m a<span className="font-bold"> software enginner</span>.
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
            className="borderBlack flex cursor-pointer items-center rounded-full bg-white p-3 text-[1.35rem] transition hover:scale-[1.15] focus:scale-[1.15] active:scale-105 dark:bg-white/10"
            href="#contact"
            aria-label="Contact me via email"
            onClick={() => {
              setActiveSection('Contact');
              setTimeOfLastClick(Date.now());
            }}
          >
            <SocialIcon name="email" />
          </a>
          <a
            className="borderBlack flex cursor-pointer items-center rounded-full bg-white p-3 text-[1.35rem] transition hover:scale-[1.15] focus:scale-[1.15] active:scale-105 dark:bg-white/10"
            href="https://github.com/ryangandev"
            aria-label="View my GitHub profile"
            target="_blank"
          >
            <SocialIcon name="github" />
          </a>
          <a
            className="borderBlack flex cursor-pointer items-center rounded-full bg-white p-3 text-[1.35rem] transition hover:scale-[1.15] focus:scale-[1.15] active:scale-105 dark:bg-white/10"
            href="https://www.linkedin.com/in/ryangan1/"
            aria-label="View my LinkedIn profile"
            target="_blank"
          >
            <SocialIcon name="linkedin" />
          </a>
        </div>
        <a
          className="borderBlack group flex cursor-pointer items-center gap-1 rounded-full bg-white px-4 py-2 text-base outline-none transition hover:scale-110 focus:scale-110 active:scale-105 dark:bg-white/10"
          href="/Rg_resume_v4.pdf"
          target="_blank"
        >
          View Résumé
          <AiOutlineDoubleRight className="opacity-60 transition group-hover:translate-x-1.5" />
        </a>
      </motion.div>
    </section>
  );
}
