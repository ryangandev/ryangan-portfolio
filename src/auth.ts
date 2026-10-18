import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { github } from 'better-auth/social-providers';

import { siteUrl } from '@/data/site';
import { canWriteToRepository } from '@/lib/admin/repository';
import { db } from '@/lib/db';

const gitHubApp = {
  clientId: process.env.AUTH_GITHUB_ID ?? '',
  clientSecret: process.env.AUTH_GITHUB_SECRET ?? '',
};

/** The stock provider, whose profile lookup the gated one below reuses */
const gitHubProfile = github(gitHubApp);

/**
 * Sign-in for the admin portal, with GitHub as the only provider.
 *
 * The provider is a GitHub App (`AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`)
 * installed on the content repository alone, so the token a sign-in yields can
 * reach that one repository and nothing else of the account's. The portal
 * commits with it, as the signed-in user.
 *
 * Users, their GitHub accounts (tokens included), and sessions are kept in the
 * `users`, `accounts`, and `sessions` tables. Sessions live in the database
 * rather than in a signed cookie, so one can be revoked by deleting its row.
 *
 * The server calls this through `getAuth().api`; over HTTP, the route handler
 * only serves GitHub's callback.
 */
const createAuth = () =>
  betterAuth({
    // GitHub only redirects back to the callback URLs registered on the app:
    // the live site's and port 3000's. Previews cannot complete a sign-in.
    baseURL:
      process.env.BETTER_AUTH_URL ??
      (process.env.NODE_ENV === 'production'
        ? siteUrl
        : 'http://localhost:3000'),
    secret: process.env.AUTH_SECRET,
    database: prismaAdapter(db, { provider: 'postgresql' }),
    socialProviders: {
      github: {
        ...gitHubApp,
        /**
         * Only someone who can push to the content repository gets in. Better
         * Auth asks for the profile before it writes anything, so a refused
         * sign-in leaves no user behind.
         */
        async getUserInfo(tokens) {
          if (
            !tokens.accessToken ||
            !(await canWriteToRepository(tokens.accessToken))
          ) {
            return null;
          }

          const info = await gitHubProfile.getUserInfo(tokens);

          return (
            info && { ...info, user: { ...info.user, login: info.data.login } }
          );
        },
        // Keeps the name, avatar, and login current with GitHub.
        overrideUserInfoOnSignIn: true,
      },
    },
    user: {
      additionalFields: {
        role: {
          type: ['USER', 'ADMIN'],
          defaultValue: 'USER',
          input: false,
        },
        login: { type: 'string', required: false },
      },
    },
    databaseHooks: {
      session: {
        create: {
          // A session is only ever made for someone the GitHub gate let
          // through, and they are the admins. Stored so the role column tells
          // the truth too.
          async before(session) {
            await db.user.update({
              where: { id: session.userId },
              data: { role: 'ADMIN' },
            });
          },
        },
      },
    },
    session: {
      // A week rather than the default month: the session can publish to the
      // live site.
      expiresIn: 60 * 60 * 24 * 7,
    },
    account: {
      // Each sign-in's OAuth state rides in an encrypted cookie, so starting one
      // needs no database.
      storeStateStrategy: 'cookie',
    },
    advanced: {
      // Like post views, sign-in keeps no IP addresses.
      ipAddress: { disableIpTracking: true },
    },
    telemetry: { enabled: false },
    // Lets server actions set the session cookie. It has to come last.
    plugins: [nextCookies()],
  });

let instance: ReturnType<typeof createAuth> | undefined;

/**
 * Better Auth sets itself up, secret check included, as soon as it is created.
 * Created on first use, then, so the build, which imports this from every
 * admin route but never signs anyone in, needs no secret.
 */
export const getAuth = () => (instance ??= createAuth());

export type Auth = ReturnType<typeof createAuth>;
