/**
 * Make a caught value readable in a log line.
 *
 * Errors pass through untouched, so their stack is still printed. The case
 * this exists for is the Neon driver, which rejects a failed WebSocket
 * connection with the socket's `ErrorEvent` rather than an Error. Logged as
 * is, that prints only `ErrorEvent { type: 'error' }`: the reason and the host
 * sit behind getters that `console.error` does not show.
 *
 * @param error whatever was thrown or rejected
 * @returns the Error itself, a one-line description of an error event, or the
 *          value unchanged
 */
export const describeError = (error: unknown): unknown => {
  if (error instanceof Error || !isErrorEvent(error)) {
    return error;
  }

  // Node's built-in WebSocket leaves the message empty on purpose; the `ws`
  // package, which `src/lib/db.ts` gives the driver, fills it in.
  const reason = error.message || 'no reason given';
  const url = error.target?.url;

  return `WebSocket error: ${reason}${url ? ` (${url})` : ''}`;
};

type ErrorEventLike = {
  type: 'error';
  message?: string;
  target?: { url?: string } | null;
};

const isErrorEvent = (value: unknown): value is ErrorEventLike =>
  typeof value === 'object' &&
  value !== null &&
  'type' in value &&
  value.type === 'error';
