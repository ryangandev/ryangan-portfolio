import { createHmac } from 'crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createImageUploadAuth,
  isImageUploadConfigured,
} from '@/lib/admin/imagekit';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('createImageUploadAuth', () => {
  it('signs token + expire with the private key, as ImageKit checks it', () => {
    vi.stubEnv('IMAGEKIT_PUBLIC_KEY', 'public_test');
    vi.stubEnv('IMAGEKIT_PRIVATE_KEY', 'private_test');

    const now = Date.UTC(2026, 8, 28, 12);
    const auth = createImageUploadAuth(now)!;

    expect(auth.publicKey).toBe('public_test');
    expect(auth.token).toMatch(/^[0-9a-f-]{36}$/);
    // Half an hour out, inside ImageKit's one-hour limit.
    expect(auth.expire).toBe(now / 1000 + 30 * 60);
    expect(auth.signature).toBe(
      createHmac('sha1', 'private_test')
        .update(`${auth.token}${auth.expire}`)
        .digest('hex'),
    );
    // Single-use on ImageKit's side, so never repeated.
    expect(createImageUploadAuth(now)!.token).not.toBe(auth.token);
  });

  it('is off, and says so, until both keys are set', () => {
    vi.stubEnv('IMAGEKIT_PUBLIC_KEY', 'public_test');
    vi.stubEnv('IMAGEKIT_PRIVATE_KEY', '');

    expect(isImageUploadConfigured()).toBe(false);
    expect(createImageUploadAuth()).toBeNull();
  });
});
