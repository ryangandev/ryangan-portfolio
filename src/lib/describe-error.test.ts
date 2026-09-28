import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { describe, expect, it } from 'vitest';

import { describeError } from '@/lib/describe-error';

describe('describeError', () => {
  it('passes Errors through, keeping the stack', () => {
    const error = new Error('relation "post_views" does not exist');

    expect(describeError(error)).toBe(error);
  });

  it('passes values that are not error events through', () => {
    expect(describeError('boom')).toBe('boom');
    expect(describeError(null)).toBe(null);
    expect(describeError({ type: 'close' })).toEqual({ type: 'close' });
  });

  it('describes an error event by its reason and URL', () => {
    const event = {
      type: 'error',
      message: 'getaddrinfo ENOTFOUND db.invalid',
      target: { url: 'wss://db.invalid/v2' },
    };

    expect(describeError(event)).toBe(
      'WebSocket error: getaddrinfo ENOTFOUND db.invalid (wss://db.invalid/v2)',
    );
  });

  it('still says something when the event carries no reason', () => {
    expect(describeError({ type: 'error', message: '', target: null })).toBe(
      'WebSocket error: no reason given',
    );
  });

  // The real thing, rather than a hand-built stand-in: the Neon driver over
  // `ws`, pointed at a host that cannot resolve, exactly as `src/lib/db.ts`
  // configures it.
  it('names the cause of a real failed Neon connection', async () => {
    neonConfig.webSocketConstructor = ws;
    const pool = new Pool({
      connectionString: 'postgresql://user:password@db.invalid/db',
    });

    const rejection = await pool.query('select 1').catch((error) => error);

    expect(rejection).not.toBeInstanceOf(Error);
    expect(describeError(rejection)).toMatch(
      // ENOTFOUND online; EAI_AGAIN on a machine with no resolver at all.
      /^WebSocket error: getaddrinfo \w+ db\.invalid \(wss:\/\/db\.invalid\/v2\)$/,
    );
  });
});
