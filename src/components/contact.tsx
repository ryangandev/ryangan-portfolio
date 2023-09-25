'use client';

import React from 'react';
import SectionHeading from './section-header';
import { motion } from 'framer-motion';
import { useSectionInView } from '@/hooks/useSectionInView';
import SubmitButton from './submit-btn';
import { sendEmail } from '@/actions/sendEmail';
import toast from 'react-hot-toast';
import { Input, Textarea } from '@nextui-org/input';

export default function Contact() {
    const { ref } = useSectionInView('Contact');

    return (
        <motion.section
            id="contact"
            ref={ref}
            className="mb-20 sm:mb-28 w-[min(100%,38rem)]"
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

            <p className="text-gray-700 -mt-4 dark:text-white/80 text-center">
                Please contact me through this form or directly at{' '}
                <a
                    className="underline"
                    href="mailto:ryangan.dev@gmail.com"
                    target="_blank"
                >
                    ryangan.dev@gmail.com
                </a>{' '}
            </p>

            <form
                className="mt-8 flex flex-col"
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
                <div className="flex flex-row gap-4">
                    <Input
                        className="transition-all"
                        name="senderName"
                        type="text"
                        isRequired
                        maxLength={500}
                        placeholder="Your name"
                        label="Name"
                        labelPlacement="outside"
                        variant="bordered"
                        size="lg"
                    />
                    <Input
                        className="transition-all"
                        name="senderEmail"
                        type="email"
                        isRequired
                        maxLength={500}
                        placeholder="Your email"
                        label="Email"
                        labelPlacement="outside"
                        variant="bordered"
                        size="lg"
                    />
                </div>

                <Textarea
                    className="mt-4 mb-2 transition-all"
                    name="message"
                    placeholder="Enter your message here..."
                    isRequired
                    maxLength={5000}
                    maxRows={5}
                    label="Message"
                    labelPlacement="outside"
                    variant="bordered"
                    size="lg"
                />
                <div className="flex justify-end">
                    <SubmitButton />
                </div>
            </form>
        </motion.section>
    );
}
