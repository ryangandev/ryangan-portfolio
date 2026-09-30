import { createImageUploadAuthAction } from '@/actions/admin-actions';

/**
 * Upload an image from the browser straight to ImageKit, which is where every
 * image on the site is served from. The server only signs the request, so the
 * file never passes through a server action and its size limit.
 * @param folder the ImageKit folder, e.g. `/Blog/my-post`
 * @returns the image's URL
 */
export const uploadImage = async (
  file: File,
  folder: string,
): Promise<string> => {
  const signed = await createImageUploadAuthAction();

  if (!signed.ok) {
    throw new Error(signed.error);
  }

  const { publicKey, token, expire, signature } = signed.auth;
  const body = new FormData();

  body.append('file', file);
  body.append('fileName', file.name);
  body.append('folder', folder);
  body.append('useUniqueFileName', 'true');
  body.append('publicKey', publicKey);
  body.append('token', token);
  body.append('expire', String(expire));
  body.append('signature', signature);

  const response = await fetch(
    'https://upload.imagekit.io/api/v1/files/upload',
    { method: 'POST', body },
  );
  const result = await response.json().catch(() => null);

  if (!response.ok || typeof result?.url !== 'string') {
    throw new Error(
      typeof result?.message === 'string'
        ? result.message
        : `ImageKit rejected the upload (${response.status})`,
    );
  }

  return result.url;
};
