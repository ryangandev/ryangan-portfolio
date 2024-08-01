'use client';

import Link from 'next/link';
import { toast } from 'sonner';

import { AiFillGithub } from 'react-icons/ai';
import { BiLogoLinkedin } from 'react-icons/bi';
import { FaDiscord, FaMedium } from 'react-icons/fa6';
import { MdLocationPin, MdOutlineEmail } from 'react-icons/md';

const ContactInfo = () => {
  const handleDiscordIdCopy = () => {
    navigator.clipboard
      .writeText('ryiscrispy')
      .then(() => {
        toast.success('Discord ID has been copied to your clipboard.');
      })
      .catch((err) => {
        toast.error('Discord ID copy failed. Please try again. ' + err);
      });
  };

  return (
    <div className="flex flex-col justify-between space-y-6">
      <div className="space-y-6 sm:space-y-12">
        <div className="space-y-2">
          <h3 className="flex items-center space-x-2">
            <span>Contact</span>
            <MdOutlineEmail />
          </h3>
          <p className="font-light text-foreground/60">ryangan.dev@gmail.com</p>
        </div>

        <div className="space-y-2">
          <h3 className="flex items-center space-x-2">
            <span>Location</span>
            <MdLocationPin />
          </h3>
          <p className="font-light text-foreground/60">Philadelphia, PA </p>
        </div>
      </div>

      <div className="flex h-9 items-center space-x-4">
        <Link
          aria-label="Link to github"
          href={'https://github.com/ryangandev'}
          target="_blank"
        >
          <AiFillGithub size={24} />
        </Link>
        <Link
          aria-label="Link to linkedin"
          href={'https://www.linkedin.com/in/ryangan1/'}
          target="_blank"
        >
          <BiLogoLinkedin size={24} />
        </Link>
        <Link
          aria-label="Link to medium"
          href={'https://medium.com/@ryangan.dev'}
          target="_blank"
        >
          <FaMedium size={24} />
        </Link>
        <span
          aria-label="Copy discord id to clipboard"
          onClick={handleDiscordIdCopy}
          className="cursor-pointer"
        >
          <FaDiscord size={24} />
        </span>
      </div>
    </div>
  );
};

export default ContactInfo;
