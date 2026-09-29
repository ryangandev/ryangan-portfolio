/**
 * A failure the admin portal can explain to its user, as opposed to a bug.
 * Server actions return `message` as it is; anything else is logged and
 * replaced with a generic message.
 */
export class AdminError extends Error {
  constructor(
    message: string,
    /**
     * `reauthorize` means the GitHub authorization is gone or expired, and
     * signing in again fixes it, so the editor offers exactly that.
     */
    readonly kind: 'reauthorize' | 'conflict' | 'invalid' | 'github',
  ) {
    super(message);
    this.name = 'AdminError';
  }
}

export const reauthorize = () =>
  new AdminError(
    'Your GitHub authorization has expired. Sign in again to continue.',
    'reauthorize',
  );

/** The HTTP status on an Octokit error, if the error has one */
export const statusOf = (error: unknown): number | undefined =>
  typeof error === 'object' &&
  error !== null &&
  'status' in error &&
  typeof error.status === 'number'
    ? error.status
    : undefined;
