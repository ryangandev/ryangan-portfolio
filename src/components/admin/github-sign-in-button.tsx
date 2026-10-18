import React from 'react';
import { redirect } from 'next/navigation';
import { AiFillGithub } from 'react-icons/ai';

import { getAuth } from '@/auth';
import { Button } from '@/components/ui/button';

type GitHubSignInButtonProps = {
  /** An admin path to land on afterwards */
  returnTo: string;
  children: React.ReactNode;
};

/** Starts the GitHub sign-in, returning to `returnTo` once it succeeds */
const GitHubSignInButton = ({
  returnTo,
  children,
}: GitHubSignInButtonProps) => {
  return (
    <form
      action={async () => {
        'use server';

        const { url } = await getAuth().api.signInSocial({
          body: {
            provider: 'github',
            callbackURL: returnTo,
            // Back to the sign-in page with the reason, still headed for the
            // same place on the next try.
            errorCallbackURL: `/admin/sign-in?callbackUrl=${encodeURIComponent(returnTo)}`,
          },
        });

        if (!url) {
          throw new Error('Better Auth returned no GitHub authorize URL');
        }

        redirect(url);
      }}
    >
      <Button type="submit" className="gap-2">
        <AiFillGithub size={18} aria-hidden />
        {children}
      </Button>
    </form>
  );
};

export default GitHubSignInButton;
