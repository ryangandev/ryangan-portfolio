import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { account } = vi.hoisted(() => ({
  account: { findFirst: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
}));

vi.mock('@/lib/db', () => ({ db: { account } }));

const { getGitHubToken } = await import('@/lib/admin/github-token');

const NOW = new Date('2026-09-28T12:00:00Z');
const inSeconds = (seconds: number) => new Date(NOW.getTime() + seconds * 1000);
const fetchMock = vi.fn();

const row = (overrides: object = {}) => ({
  id: 'account-1',
  accessToken: 'old-access',
  refreshToken: 'old-refresh',
  accessTokenExpiresAt: inSeconds(3600),
  ...overrides,
});

const refreshResponse = (body: object) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers({ now: NOW });
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('AUTH_GITHUB_ID', 'client-id');
  vi.stubEnv('AUTH_GITHUB_SECRET', 'client-secret');
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('getGitHubToken', () => {
  it('returns a token that is not about to expire as it is', async () => {
    account.findFirst.mockResolvedValue(row());

    await expect(getGitHubToken('user-1')).resolves.toBe('old-access');
    expect(account.findFirst).toHaveBeenCalledWith({
      where: { userId: 'user-1', providerId: 'github' },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('treats a token without an expiry, as an OAuth App issues, as fresh', async () => {
    account.findFirst.mockResolvedValue(
      row({ accessTokenExpiresAt: null, refreshToken: null }),
    );

    await expect(getGitHubToken('user-1')).resolves.toBe('old-access');
  });

  it('refreshes a token within a minute of expiring, and stores the new pair', async () => {
    account.findFirst.mockResolvedValue(
      row({ accessTokenExpiresAt: inSeconds(30) }),
    );
    fetchMock.mockResolvedValue(
      refreshResponse({
        access_token: 'new-access',
        refresh_token: 'new-refresh',
        expires_in: 28800,
        refresh_token_expires_in: 15897600,
      }),
    );

    await expect(getGitHubToken('user-1')).resolves.toBe('new-access');

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://github.com/login/oauth/access_token');
    expect(JSON.parse(init.body)).toEqual({
      client_id: 'client-id',
      client_secret: 'client-secret',
      grant_type: 'refresh_token',
      refresh_token: 'old-refresh',
    });
    expect(account.update).toHaveBeenCalledWith({
      where: { id: 'account-1' },
      data: {
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
        accessTokenExpiresAt: inSeconds(28800),
        refreshTokenExpiresAt: inSeconds(15897600),
      },
    });
  });

  it('asks for a new sign-in when GitHub refuses the refresh', async () => {
    account.findFirst.mockResolvedValue(
      row({ accessTokenExpiresAt: inSeconds(-1) }),
    );
    account.findUnique.mockResolvedValue(
      row({ accessTokenExpiresAt: inSeconds(-1) }),
    );
    // GitHub answers a refused refresh with a 200 and an error field.
    fetchMock.mockResolvedValue(
      refreshResponse({ error: 'bad_refresh_token' }),
    );

    await expect(getGitHubToken('user-1')).rejects.toMatchObject({
      kind: 'reauthorize',
    });
    expect(account.update).not.toHaveBeenCalled();
  });

  it('uses the token a concurrent request refreshed first', async () => {
    account.findFirst.mockResolvedValue(
      row({ accessTokenExpiresAt: inSeconds(-1) }),
    );
    account.findUnique.mockResolvedValue(
      row({
        accessToken: 'raced-access',
        accessTokenExpiresAt: inSeconds(28800),
      }),
    );
    fetchMock.mockResolvedValue(
      refreshResponse({ error: 'bad_refresh_token' }),
    );

    await expect(getGitHubToken('user-1')).resolves.toBe('raced-access');
  });

  it('asks for a new sign-in without a token, or with an expired one and no refresh token', async () => {
    account.findFirst.mockResolvedValueOnce(null);
    await expect(getGitHubToken('user-1')).rejects.toMatchObject({
      kind: 'reauthorize',
    });

    account.findFirst.mockResolvedValueOnce(
      row({ accessTokenExpiresAt: inSeconds(-1), refreshToken: null }),
    );
    await expect(getGitHubToken('user-1')).rejects.toMatchObject({
      kind: 'reauthorize',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
