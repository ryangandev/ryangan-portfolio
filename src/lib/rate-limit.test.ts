import { createHash } from 'node:crypto';

import { beforeEach, describe, expect, it, vi } from 'vitest';

const { contactSubmission, requestHeaders } = vi.hoisted(() => ({
  contactSubmission: {
    create: vi.fn(),
    count: vi.fn(),
    deleteMany: vi.fn(),
  },
  requestHeaders: new Headers(),
}));

vi.mock('@/lib/db', () => ({ db: { contactSubmission } }));
vi.mock('next/headers', () => ({ headers: async () => requestHeaders }));

const { allowContactSubmission, recordAttempt, recordDurableAttempt } =
  await import('@/lib/rate-limit');

const MINUTE = 60_000;
const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex');

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  contactSubmission.create.mockResolvedValue({});
  contactSubmission.deleteMany.mockResolvedValue({ count: 0 });
});

describe('recordAttempt (in-memory fallback)', () => {
  it('allows three attempts per ten minutes, then drops', () => {
    const start = 1_000_000;

    expect(recordAttempt('memory-a', start)).toBe(true);
    expect(recordAttempt('memory-a', start + MINUTE)).toBe(true);
    expect(recordAttempt('memory-a', start + 2 * MINUTE)).toBe(true);
    expect(recordAttempt('memory-a', start + 3 * MINUTE)).toBe(false);
  });

  it('counts each caller separately', () => {
    const start = 2_000_000;

    for (let i = 0; i < 3; i++) recordAttempt('memory-b', start);

    expect(recordAttempt('memory-b', start)).toBe(false);
    expect(recordAttempt('memory-c', start)).toBe(true);
  });

  it('lets a caller back in once the oldest attempt leaves the window', () => {
    const start = 3_000_000;

    for (let i = 0; i < 3; i++) recordAttempt('memory-d', start + i * MINUTE);

    expect(recordAttempt('memory-d', start + 10 * MINUTE - 1)).toBe(false);
    expect(recordAttempt('memory-d', start + 10 * MINUTE)).toBe(true);
  });
});

describe('recordDurableAttempt', () => {
  it('records the attempt before counting, and allows up to three in the window', async () => {
    contactSubmission.count.mockResolvedValue(3);
    const now = Date.UTC(2026, 8, 28, 12);

    expect(await recordDurableAttempt('key', now)).toBe(true);

    expect(contactSubmission.create.mock.invocationCallOrder[0]).toBeLessThan(
      contactSubmission.count.mock.invocationCallOrder[0],
    );
    expect(contactSubmission.create).toHaveBeenCalledWith({
      data: { clientKey: 'key', submittedAt: new Date(now) },
    });
    expect(contactSubmission.count).toHaveBeenCalledWith({
      where: {
        clientKey: 'key',
        submittedAt: { gt: new Date(now - 10 * MINUTE) },
      },
    });
  });

  it('drops the fourth attempt in the window', async () => {
    contactSubmission.count.mockResolvedValue(4);

    expect(await recordDurableAttempt('key', Date.now())).toBe(false);
  });

  it('deletes rows older than a day', async () => {
    contactSubmission.count.mockResolvedValue(1);
    const now = Date.UTC(2026, 8, 28, 12);

    await recordDurableAttempt('key', now);

    expect(contactSubmission.deleteMany).toHaveBeenCalledWith({
      where: { submittedAt: { lt: new Date(now - 24 * 60 * MINUTE) } },
    });
  });
});

describe('allowContactSubmission', () => {
  it('stores a hash of the first forwarded address, never the address', async () => {
    requestHeaders.set('x-forwarded-for', '203.0.113.7, 10.0.0.1');
    contactSubmission.count.mockResolvedValue(1);

    expect(await allowContactSubmission()).toBe(true);

    const { clientKey } = contactSubmission.create.mock.calls[0][0].data;
    expect(clientKey).toBe(sha256('203.0.113.7'));
    expect(JSON.stringify(contactSubmission.create.mock.calls)).not.toContain(
      '203.0.113.7',
    );
  });

  it('falls back to the in-memory window when the database fails', async () => {
    requestHeaders.set('x-forwarded-for', '198.51.100.23');
    contactSubmission.create.mockRejectedValue(
      new Error('relation does not exist'),
    );

    const results = [];
    for (let i = 0; i < 4; i++) results.push(await allowContactSubmission());

    expect(results).toEqual([true, true, true, false]);
    expect(console.error).toHaveBeenCalledTimes(4);
  });
});
