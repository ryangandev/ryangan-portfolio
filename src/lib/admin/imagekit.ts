import { createHmac, randomUUID } from 'crypto';

/** What the browser needs to upload one file straight to ImageKit */
export type ImageUploadAuth = {
  publicKey: string;
  token: string;
  expire: number;
  signature: string;
};

/**
 * ImageKit takes an `expire` up to an hour ahead. Half that leaves room for a
 * slow upload without handing out long-lived signatures.
 */
const SIGNATURE_LIFETIME_SECONDS = 30 * 60;

const keys = () => {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  return publicKey && privateKey ? { publicKey, privateKey } : null;
};

/**
 * Whether the editor should offer image uploads. Without the keys it hides
 * them, and image URLs can still be pasted in.
 */
export const isImageUploadConfigured = (): boolean => keys() !== null;

/**
 * Sign one upload, following ImageKit's client-side upload scheme: the
 * signature is an HMAC-SHA1 of `token + expire` under the private key, so the
 * browser can upload without ever holding the key. The token is single-use on
 * ImageKit's side.
 * @returns null when uploads are not configured
 */
export const createImageUploadAuth = (
  now: number = Date.now(),
): ImageUploadAuth | null => {
  const configured = keys();

  if (!configured) {
    return null;
  }

  const token = randomUUID();
  const expire = Math.floor(now / 1000) + SIGNATURE_LIFETIME_SECONDS;
  const signature = createHmac('sha1', configured.privateKey)
    .update(token + expire)
    .digest('hex');

  return { publicKey: configured.publicKey, token, expire, signature };
};
