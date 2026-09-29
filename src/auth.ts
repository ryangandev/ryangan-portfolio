import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { storeGitHubTokens } from '@/lib/admin/github-token';
import { canWriteToRepository } from '@/lib/admin/repository';
import { db } from '@/lib/db';

/**
 * Sign-in for the admin portal, with GitHub as the only provider.
 *
 * The provider is a GitHub App (`AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`)
 * installed on the content repository alone, so the token a sign-in yields can
 * reach that one repository and nothing else of the account's. The portal
 * commits with it, as the signed-in user.
 *
 * Users and their GitHub accounts, tokens included, are kept in the `users` and
 * `accounts` tables through the Prisma adapter. Sessions are JWTs in a cookie,
 * which is why there is no session table.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [GitHub],
  session: {
    strategy: 'jwt',
    // A week rather than the default month: the session can publish to the
    // live site.
    maxAge: 60 * 60 * 24 * 7,
  },
  pages: {
    signIn: '/admin/sign-in',
    error: '/admin/sign-in',
  },
  callbacks: {
    /**
     * Only someone who can push to the content repository gets in. This runs
     * before Auth.js writes anything, so a refused sign-in leaves no user
     * behind.
     */
    async signIn({ account }) {
      return (
        account?.provider === 'github' &&
        typeof account.access_token === 'string' &&
        (await canWriteToRepository(account.access_token))
      );
    },
    async jwt({ token, user, account, profile }) {
      // Present only on the request that completes a sign-in.
      if (account?.access_token && user?.id) {
        await storeGitHubTokens(user.id, {
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
        });
        // The sign-in callback only lets repository writers through, and they
        // are the admins. Stored so the role column tells the truth too.
        await db.user.update({
          where: { id: user.id },
          data: { role: 'ADMIN' },
        });
        token.role = 'ADMIN';
        token.login = typeof profile?.login === 'string' ? profile.login : '';
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub ?? '';
      session.user.role = token.role === 'ADMIN' ? 'ADMIN' : undefined;
      session.user.login =
        typeof token.login === 'string' ? token.login : undefined;

      return session;
    },
  },
});
