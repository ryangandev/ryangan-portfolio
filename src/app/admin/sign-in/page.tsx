import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import GitHubSignInButton from '@/components/admin/github-sign-in-button';
import Callout from '@/components/callout';
import BackButton from '@/components/navigation/back-button';
import PageSummary from '@/components/page-summary';
import { contentRepository } from '@/data/site';
import { getAdmin } from '@/lib/admin/session';

export const metadata: Metadata = {
  title: 'Sign in',
};

const repository = `${contentRepository.owner}/${contentRepository.name}`;

/** The `error` values Auth.js redirects here with */
const errors: Record<string, string> = {
  AccessDenied: `That GitHub account cannot push to ${repository}, so it cannot use the admin.`,
  Configuration:
    'Sign-in is not set up on this deployment. It needs AUTH_SECRET, AUTH_GITHUB_ID, and AUTH_GITHUB_SECRET.',
  OAuthAccountNotLinked:
    'Another sign-in already uses the email address of that GitHub account.',
};

/** Only ever return to an admin page, never to another site */
const safeReturnTo = (value: unknown): string =>
  typeof value === 'string' && /^\/admin(?:[/?#]|$)/.test(value)
    ? value
    : '/admin';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { callbackUrl, error } = await searchParams;
  const returnTo = safeReturnTo(callbackUrl);

  if (await getAdmin()) {
    redirect(returnTo);
  }

  return (
    <main className="relative">
      <BackButton name="Home" href="/" />
      <h1>Admin</h1>
      <PageSummary>
        Write posts and add projects to this site. Sign in with a GitHub account
        that can push to {repository}.
      </PageSummary>
      {typeof error === 'string' && (
        <Callout type="danger">
          <p className="mb-0 text-sm">
            {errors[error] ?? 'Signing in did not work. Try again.'}
          </p>
        </Callout>
      )}
      <GitHubSignInButton returnTo={returnTo}>
        Sign in with GitHub
      </GitHubSignInButton>
    </main>
  );
}
