import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { postView, postViewSession } = vi.hoisted(() => ({
  postView: { findUnique: vi.fn(), upsert: vi.fn() },
  postViewSession: { createMany: vi.fn(), deleteMany: vi.fn() },
}));

vi.mock('@/lib/db', () => ({ db: { postView, postViewSession } }));

const { getPostViews, recordPostView } = await import('@/lib/views');

const NOW = new Date('2026-09-28T12:00:00Z');
const DAY = 24 * 60 * 60_000;

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers({ now: NOW });
  vi.spyOn(console, 'error').mockImplementation(() => {});
  postViewSession.deleteMany.mockResolvedValue({ count: 0 });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('recordPostView', () => {
  it('counts a new session and prunes sessions older than 30 days', async () => {
    postViewSession.createMany.mockResolvedValue({ count: 1 });
    postView.upsert.mockResolvedValue({ slug: 'a', count: 8 });

    await expect(recordPostView('a', 'session-1')).resolves.toBe(8);

    expect(postView.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ update: { count: { increment: 1 } } }),
    );
    expect(postViewSession.deleteMany).toHaveBeenCalledWith({
      where: { viewedAt: { lt: new Date(NOW.getTime() - 30 * DAY) } },
    });
  });

  it('reads the total without counting or pruning a repeat view', async () => {
    postViewSession.createMany.mockResolvedValue({ count: 0 });
    postView.findUnique.mockResolvedValue({ slug: 'a', count: 7 });

    await expect(recordPostView('a', 'session-1')).resolves.toBe(7);

    expect(postView.upsert).not.toHaveBeenCalled();
    expect(postViewSession.deleteMany).not.toHaveBeenCalled();
  });

  it('fails soft, logging why the database was unreachable', async () => {
    postViewSession.createMany.mockRejectedValue({
      type: 'error',
      message: 'getaddrinfo ENOTFOUND db.invalid',
      target: { url: 'wss://db.invalid/v2' },
    });

    await expect(recordPostView('a', 'session-1')).resolves.toBeNull();

    expect(console.error).toHaveBeenCalledWith(
      'Post view write error:',
      'WebSocket error: getaddrinfo ENOTFOUND db.invalid (wss://db.invalid/v2)',
    );
  });
});

describe('getPostViews', () => {
  it('reads zero for a post nobody has viewed', async () => {
    postView.findUnique.mockResolvedValue(null);

    await expect(getPostViews('a')).resolves.toBe(0);
  });

  it('fails soft to null', async () => {
    postView.findUnique.mockRejectedValue(new Error('boom'));

    await expect(getPostViews('a')).resolves.toBeNull();
  });
});
