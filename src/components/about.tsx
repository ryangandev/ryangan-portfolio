'use client';

import React from 'react';
import { motion } from 'framer-motion';

import Heading from '@/components/heading';
import { useSectionInView } from '@/hooks/useSectionInView';

export default function About() {
  const { ref } = useSectionInView('About');

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] scroll-mt-28 text-center leading-8"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <Heading size="sm">About Me</Heading>

      <p className="mb-3">
        <span className="italic">
          An interest in programming and a strong work ethic{' '}
        </span>
        ignited my passion for full-stack development. I am a recent graduate
        from Drexel University with a BS in Computer Science.
      </p>
    </motion.section>
  );
}
