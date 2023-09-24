'use client';

import React from 'react';
import SectionHeading from './section-header';
import { motion } from 'framer-motion';
import { useSectionInView } from '@/hooks/useSectionInView';
import SubmitButton from './submit-btn';
import { sendEmail } from '@/actions/sendEmail';
import toast from 'react-hot-toast';

export default function Contact() {
    const { ref } = useSectionInView('Contact');

    return (
        <motion.section
            id="contact"
            ref={ref}
            className="mb-20 sm:mb-28 w-[min(100%,38rem)] text-center"
            initial={{
                opacity: 0,
            }}
            whileInView={{
                opacity: 1,
            }}
            transition={{
                duration: 1,
            }}
            viewport={{
                once: true,
            }}
        >
            <SectionHeading>Contact me</SectionHeading>

            <p className="text-gray-700 -mt-6 dark:text-white/80">
                Please contact me through this form or directly at{' '}
                <a className="underline" href="mailto:example@gmail.com">
                    ryangan.dev@gmail.com
                </a>{' '}
            </p>

            <form
                className="mt-6 flex flex-col dark:text-black"
                action={async (formData) => {
                    const { data, error } = await sendEmail(formData);

                    if (error) {
                        toast.error(error);
                        return;
                    } else if (
                        // The data response could be an error if the response contains a message property and a status code that's not 200
                        data &&
                        typeof data === 'object' &&
                        'statusCode' in data &&
                        data.statusCode !== 200 &&
                        'message' in data
                    ) {
                        toast.error(String(data.message));
                        return;
                    }

                    toast.success('Email sent successfully!');
                }}
            >
                <input
                    className="h-14 px-4 rounded-lg borderBlack dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
                    name="senderEmail"
                    type="email"
                    required
                    maxLength={500}
                    placeholder="Your email"
                />
                <textarea
                    className="h-52 my-3 rounded-lg borderBlack p-4 dark:bg-white dark:bg-opacity-80 dark:focus:bg-opacity-100 transition-all dark:outline-none"
                    name="message"
                    placeholder="Your message"
                    required
                    maxLength={5000}
                />
                <div className="flex justify-end">
                    <SubmitButton />
                </div>
            </form>
        </motion.section>
    );
}
