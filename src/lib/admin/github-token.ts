import { db } from '@/lib/db';
import { reauthorize } from '@/lib/admin/errors';

/** Refresh this long before expiry, so a token cannot lapse mid-request */
const EXPIRY_MARGIN_MS = 60_000;

type GitHubTokens = {
  accessToken: string;
  refreshToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
};

const isFresh = (expiresAt: Date | null) =>
  expiresAt === null || expiresAt.getTime() > Date.now() + EXPIRY_MARGIN_MS;

const inSeconds = (seconds: unknown) =>
  typeof seconds === 'number' ? new Date(Date.now() + seconds * 1000) : null;

/**
 * Trade a refresh token for a new pair of tokens
 * @returns null when GitHub refuses, e.g. the refresh token expired, was
 *          revoked, or was already used
 */
const refreshTokens = async (
  refreshToken: string,
): Promise<GitHubTokens | null> => {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.AUTH_GITHUB_ID,
      client_secret: process.env.AUTH_GITHUB_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });
  // GitHub reports a refused refresh as a 200 with an `error` field.
  const body = response.ok ? await response.json() : null;

  if (typeof body?.access_token !== 'string') {
    return null;
  }

  return {
    accessToken: body.access_token,
    refreshToken:
      typeof body.refresh_token === 'string' ? body.refresh_token : null,
    accessTokenExpiresAt: inSeconds(body.expires_in),
    refreshTokenExpiresAt: inSeconds(body.refresh_token_expires_in),
  };
};

/**
 * A GitHub access token for the signed-in admin, refreshed if it is about to
 * expire.
 *
 * Tokens from a GitHub App expire after eight hours and come with a refresh
 * token; tokens from an OAuth App do not expire, and have neither. Better Auth
 * stores a fresh pair on every sign-in. It can refresh them too, but with a
 * five-second margin and no answer to the race below, so this does it.
 *
 * @throws AdminError `reauthorize` when there is no usable token
 */
export const getGitHubToken = async (userId: string): Promise<string> => {
  const account = await db.account.findFirst({
    where: { userId, providerId: 'github' },
  });

  if (!account?.accessToken) {
    throw reauthorize();
  }

  if (isFresh(account.accessTokenExpiresAt)) {
    return account.accessToken;
  }

  if (!account.refreshToken) {
    throw reauthorize();
  }

  const refreshed = await refreshTokens(account.refreshToken);

  if (!refreshed) {
    // GitHub rotates the refresh token on every use, so two requests that
    // raced to refresh leave the loser holding a spent one. The winner has
    // stored a fresh access token by now.
    const latest = await db.account.findUnique({ where: { id: account.id } });

    if (latest?.accessToken && isFresh(latest.accessTokenExpiresAt)) {
      return latest.accessToken;
    }

    throw reauthorize();
  }

  await db.account.update({ where: { id: account.id }, data: refreshed });

  return refreshed.accessToken;
};
