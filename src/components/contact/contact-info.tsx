'use client';

import { useEffect, useState } from 'react';
import { LuCheck, LuCopy } from 'react-icons/lu';
import { toast } from 'sonner';

import AnimatedLink from '@/components/animated-link';
import SocialIcon from '@/components/icons/social-icon';
import { authorProfiles } from '@/data/site';
import { SocialIconName } from '@/models/data';

const email = 'ryangan.dev@gmail.com';
const discordId = 'ryiscrispy';

type CopyButtonProps = {
  value: string;
  /** What `value` is, as the toast and the button's label name it */
  what: string;
};

/**
 * Confirms with a toast and, for a moment, a check in place of the copy icon
 */
const CopyButton = ({ value, what }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;

    const timeout = setTimeout(() => setIsCopied(false), 2000);

    return () => clearTimeout(timeout);
  }, [isCopied]);

  const copy = () => {
    navigator.clipboard.writeText(value).then(
      () => {
        setIsCopied(true);
        toast.success(`${what} has been copied to your clipboard.`);
      },
      (error) => {
        toast.error(`${what} copy failed. Please try again. ` + error);
      },
    );
  };

  const Icon = isCopied ? LuCheck : LuCopy;

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${what}`}
      title={`Copy ${what}`}
      className="-my-1 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md color-level-5 transition-colors hover:bg-neutral-100 hover:color-level-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden dark:hover:bg-neutral-800"
    >
      <Icon aria-hidden className="size-4" />
    </button>
  );
};

const Row = ({
  icon,
  label,
  children,
}: {
  icon: SocialIconName;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center border-b py-3">
    {/*
      On a phone the icon alone names the row, leaving the value room for a
      whole email address; the label is still read out.
    */}
    <dt className="flex w-10 shrink-0 items-center gap-2 color-level-5 md:w-40">
      <SocialIcon name={icon} size={16} className="shrink-0" />
      <span className="sr-only md:not-sr-only">{label}</span>
    </dt>
    <dd className="flex min-w-0 flex-1 items-center justify-between gap-2">
      {children}
    </dd>
  </div>
);

/** The ways to reach me other than the form, one per row */
const ContactInfo = () => {
  return (
    <dl className="border-t">
      <Row icon="email" label="Email">
        <AnimatedLink href={`mailto:${email}`} isExternal>
          {email}
        </AnimatedLink>
        <CopyButton value={email} what="Email address" />
      </Row>
      {authorProfiles.map((profile) => (
        <Row key={profile.name} icon={profile.icon} label={profile.name}>
          <AnimatedLink href={profile.url} isExternal>
            {profile.handle}
          </AnimatedLink>
        </Row>
      ))}
      <Row icon="discord" label="Discord">
        <span className="font-medium color-level-2">{discordId}</span>
        <CopyButton value={discordId} what="Discord ID" />
      </Row>
      <Row icon="location" label="Location">
        <span className="font-medium color-level-2">San Jose, CA</span>
      </Row>
    </dl>
  );
};

export default ContactInfo;
