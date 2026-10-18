/**
 * Admin pages wait on GitHub, often for a second or two, so unlike the static
 * public pages they get a loading state: a thin bar across the top, as the
 * reading progress bar on posts is, rather than a screen that replaces the
 * layout.
 *
 * The bar is fixed to the window, but it sits inside an empty block in the
 * content column. The cross-fade between pages measures that block, which is
 * where every page starts, so the page fades in place. Measuring the bar
 * itself, a 2px strip across the top, made the page grow out of the corner.
 */
export default function Loading() {
  return (
    <div role="status">
      <div className="admin-loading" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
