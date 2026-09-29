import React from 'react';
import { AiFillGithub } from 'react-icons/ai';

import { signIn } from '@/auth';
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

        await signIn('github', { redirectTo: returnTo });
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
