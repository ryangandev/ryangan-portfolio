'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from './section-header';

export default function About() {
    return (
        <motion.section
            className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.175 }}
            id="about"
        >
            <SectionHeader>About me</SectionHeader>
            <p className="mb-3">
                I am currently a senior at Drexel University, pursuing a{' '}
                <span className="font-medium">Bachelor&apos;s degree</span> in{' '}
                <span className="font-medium">Computer Science</span> with
                concentrations in{' '}
                <span className="font-medium">Artificial Intelligence</span> and{' '}
                <span className="font-medium">Game Development</span>. My
                journey began with a passion for programming and has since
                evolved into a love for{' '}
                <span className="font-medium">full-stack development</span>.
            </p>

            <p className="mb-3">
                For me,{' '}
                <span className="italic">software development is an art</span>.
                It&apos;s about crafting{' '}
                <span className="italic">intuitive solutions</span> that
                aren&apos;t just functional but also offer users a delightful
                experience. What I relish most about programming is the{' '}
                <span className="font-medium">
                    challenge of problem-solving
                </span>
                . Crafting efficient, clean code is a joy, not just for the
                performance benefits but also because it enhances{' '}
                <span className="font-medium">
                    readability and comprehension
                </span>
                .
            </p>

            <p className="mb-3">
                My expertise spans a{' '}
                <span className="font-medium">broad tech stack</span>, including
                frontend tools like{' '}
                <span className="font-medium">
                    React, React Native, and Next.Js
                </span>
                , backend frameworks such as{' '}
                <span className="font-medium">Node.js and Spring Boot</span>,
                and databases like{' '}
                <span className="font-medium">Postgres and MySQL</span>. As I
                seek a{' '}
                <span className="italic">
                    full-time software developer role
                </span>
                , I&apos;m also expanding my skills, currently exploring{' '}
                <span className="font-medium">
                    iOS development with SwiftUI{' '}
                </span>
                and the <span className="font-medium">Rust</span> programming
                language.
            </p>

            <p className="mb-3">
                I carry with me not just my technical expertise but also a{' '}
                <span className="font-medium">growth mindset</span>. I believe
                in the power of{' '}
                <span className="italic">incremental learning</span>. Even a
                small nugget of new knowledge each day can be transformative,
                sculpting me into a better professional and individual.
            </p>

            <p>
                Away from the coding, I unwind with video games and spendingtime
                with my cats.{' '}
                <span className="italic">
                    Everyday is an opportunity to learn
                </span>
                , and I&apos;m keen to seize it!
            </p>
        </motion.section>
    );
}
