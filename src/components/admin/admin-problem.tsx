import React from 'react';

import GitHubSignInButton from '@/components/admin/github-sign-in-button';
import Callout from '@/components/callout';
import { AdminError } from '@/lib/admin/errors';

type AdminProblemProps = {
  error: AdminError;
  /** Where signing in again should return to */
  returnTo: string;
};

/**
 * Why an admin page could not load its content from GitHub, with a way to
 * sign in again when that is the fix
 */
const AdminProblem = ({ error, returnTo }: AdminProblemProps) => {
  return (
    <Callout type="warning">
      <p className="text-sm">{error.message}</p>
      {error.kind === 'reauthorize' && (
        <GitHubSignInButton returnTo={returnTo}>
          Sign in again
        </GitHubSignInButton>
      )}
    </Callout>
  );
};

export default AdminProblem;
