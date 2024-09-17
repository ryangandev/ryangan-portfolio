'use client';

import { motion } from 'framer-motion';

import ContactInfo from './contact-info';
import ContactForm from './contact-form';

const Contact = () => {
  return (
    <motion.section
      id="contact"
      className=""
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ContactInfo />
        <ContactForm />
      </div>
    </motion.section>
  );
};

export default Contact;
