'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './section-header';
import { useSectionInView } from '@/hooks/useSectionInView';

export default function About() {
    const { ref } = useSectionInView('About');

    return (
        <motion.section
            ref={ref}
            className="max-w-[45rem] text-center leading-8 mb-28 scroll-mt-28"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.175 }}
            id="about"
        >
            <SectionHeader>About me</SectionHeader>

            <p className="mb-3">
                <span className="italic">
                    An interest in programming and a strong work ethic{' '}
                </span>
                ignited my passion for full-stack development. I am a recent
                graduate from Drexel University with a BS in Computer Science.
            </p>

            <p className="mb-3">
                <span className="italic">Software development is an art.</span>{' '}
                It&apos;s about crafting intuitive solutions that are both
                functional and provide a delightful user experience. Writing
                efficient, clean code is a honed craft that benefits program
                performance and comprehension.
            </p>

            <p>
                <span className="italic">
                    Everyday is an opportunity to learn.
                </span>{' '}
                I carry with me not just my technical expertise, but also an
                opportunistic mindset. I believe in the power of incremental
                learning. Gaining new knowledge from overcoming technical
                challenges makes me a better developer.
            </p>
        </motion.section>
    );
}
