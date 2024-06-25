import { FaGithub } from 'react-icons/fa';

import { githubSignInAction, signOutAction } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';

export function GithubSigninButton() {
  return (
    <form action={githubSignInAction}>
      <Button size="sm" className="space-x-2" variant="default">
        <FaGithub size={18} />
        <span>Sign in with GitHub</span>
      </Button>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button size="sm" className="space-x-2" variant="default">
        <FaGithub size={18} />
        <span>Sign out</span>
      </Button>
    </form>
  );
}
