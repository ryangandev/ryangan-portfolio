import { db } from '@/lib/db';
import { reauthorize } from '@/lib/admin/errors';

/** Refresh this long before expiry, so a token cannot lapse mid-request */
const EXPIRY_MARGIN_SECONDS = 60;

type GitHubTokens = {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
};

const nowInSeconds = () => Math.floor(Date.now() / 1000);

const isFresh = (expiresAt: number | null) =>
  expiresAt === null || expiresAt > nowInSeconds() + EXPIRY_MARGIN_SECONDS;

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
    access_token: body.access_token,
    refresh_token: body.refresh_token,
    expires_at:
      typeof body.expires_in === 'number'
        ? nowInSeconds() + body.expires_in
        : undefined,
  };
};

/**
 * Store the tokens from a sign-in on the user's GitHub account row.
 *
 * Auth.js writes them when it first links an account and never again, so
 * without this a second sign-in would leave the old, possibly revoked, tokens
 * in place, and signing in again would not fix an expired authorization.
 */
export const storeGitHubTokens = async (
  userId: string,
  tokens: GitHubTokens,
): Promise<void> => {
  await db.account.updateMany({
    where: { userId, provider: 'github' },
    data: {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token ?? null,
      expires_at: tokens.expires_at ?? null,
    },
  });
};

/**
 * A GitHub access token for the signed-in admin, refreshed if it is about to
 * expire.
 *
 * Tokens from a GitHub App expire after eight hours and come with a refresh
 * token; tokens from an OAuth App do not expire, and have neither.
 *
 * @throws AdminError `reauthorize` when there is no usable token
 */
export const getGitHubToken = async (userId: string): Promise<string> => {
  const account = await db.account.findFirst({
    where: { userId, provider: 'github' },
  });

  if (!account?.access_token) {
    throw reauthorize();
  }

  if (isFresh(account.expires_at)) {
    return account.access_token;
  }

  if (!account.refresh_token) {
    throw reauthorize();
  }

  const refreshed = await refreshTokens(account.refresh_token);

  if (!refreshed) {
    // GitHub rotates the refresh token on every use, so two requests that
    // raced to refresh leave the loser holding a spent one. The winner has
    // stored a fresh access token by now.
    const latest = await db.account.findUnique({ where: { id: account.id } });

    if (latest?.access_token && isFresh(latest.expires_at)) {
      return latest.access_token;
    }

    throw reauthorize();
  }

  await storeGitHubTokens(userId, refreshed);

  return refreshed.access_token;
};
