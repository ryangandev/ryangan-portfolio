import {
  GithubSigninButton,
  SignOutButton,
} from '@/components/auth-components';
import SectionHeader from '@/components/section-header';
import { auth } from '@/libs/auth';

export default async function Page() {
  const session = await auth();

  return (
    <main className="contentContainerPadding">
      <div className="mx-auto w-full max-w-2xl">
        <SectionHeader section="Sign My Guestbook" />
        {session?.user ? <SignOutButton /> : <GithubSigninButton />}
        {session?.user && <p>Welcome {session.user.name}!</p>}
      </div>
    </main>
  );
}
