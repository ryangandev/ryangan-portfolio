/**
 * A link's address as a reader would type it, split into the pieces a line
 * may break between. The scheme and `www.` go, a GitHub repository reads as
 * `owner/repo`, an itch.io game as `itch.io/game` without the uploader's
 * subdomain, and each piece ends at a `/`, so a long address wraps after
 * a slash rather than inside a word or at one of its hyphens.
 */
export const displayUrlParts = (url: string): string[] => {
  const { host, pathname } = new URL(url);
  const path = pathname.replace(/\/$/, '');
  const repository = host === 'github.com' && /^\/[^/]+\/[^/]+$/.test(path);
  const itchGame = host.endsWith('.itch.io') && /^\/[^/]+$/.test(path);
  const address = repository
    ? path.slice(1)
    : itchGame
      ? `itch.io${path}`
      : `${host.replace(/^www\./, '')}${path}`;

  return address.match(/[^/]+\/?/g) ?? [address];
};
