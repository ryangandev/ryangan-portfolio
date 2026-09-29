/**
 * Admin pages wait on GitHub, often for a second or two, so unlike the static
 * public pages they get a loading state: a thin bar across the top, as the
 * reading progress bar on posts is, rather than a screen that replaces the
 * layout.
 */
export default function Loading() {
  return (
    <div role="status" className="admin-loading">
      <span className="sr-only">Loading</span>
    </div>
  );
}
