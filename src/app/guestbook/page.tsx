import {
  GithubSigninButton,
  SignOutButton,
} from '@/components/auth-components';
import PageSummary from '@/components/page-summary';
import SectionHeader from '@/components/section-header';
import { auth } from '@/libs/auth';

const Page = async () => {
  const session = await auth();

  return (
    <main className="contentContainerPadding">
      <div className="mx-auto w-full max-w-2xl">
        <SectionHeader section="Sign My Guestbook" />
        <PageSummary
          content={
            'This is my guestbook. Feel free to leave anything you want to say.'
          }
        />
        {session?.user ? <SignOutButton /> : <GithubSigninButton />}
        {session?.user && <p>Welcome {session.user.name}!</p>}
      </div>
    </main>
  );
};

export default Page;
