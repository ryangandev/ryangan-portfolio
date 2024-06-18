'use client';

import React from 'react';
import SectionHeading from './section-header';
import { motion } from 'framer-motion';
import { useSectionInView } from '@/hooks/useSectionInView';
import SubmitButton from './submit-btn';
import { sendEmail } from '@/actions/sendEmail';
import toast from 'react-hot-toast';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export default function Contact() {
  const { ref } = useSectionInView('Contact');

  return (
    <motion.section
      id="contact"
      ref={ref}
      className="mb-20 w-[min(100%,38rem)] sm:mb-28"
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

      <p className="-mt-4 text-center text-gray-700 dark:text-white/80">
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
        <div className="flex flex-col gap-8 sm:flex-row">
          <Input
            className="transition-all"
            name="senderName"
            type="text"
            maxLength={500}
            placeholder="Your name"
          />
          <Input
            className="transition-all"
            name="senderEmail"
            type="email"
            maxLength={500}
            placeholder="Your email"
          />
        </div>

        <Textarea
          className="mb-4 mt-8 transition-all"
          name="message"
          placeholder="Enter your message here..."
          maxLength={5000}
        />
        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </motion.section>
  );
}
