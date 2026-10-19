/** A width and height in CSS pixels */
export type Size = { width: number; height: number };

/** An offset from the centre of the viewer's image area, in CSS pixels */
export type Point = { x: number; y: number };

/** How much each press of zoom in or zoom out multiplies the zoom by */
export const zoomStep = 1.5;

/** The most a screenshot is enlarged, as a multiple of its fitted size */
const zoomCeiling = 8;

/**
 * The size an image is shown at to fit `area` whole, never enlarged past its
 * own pixels, so a small image is not blown up into a blur.
 */
export const fitSize = (natural: Size, area: Size): Size => {
  if (natural.width <= 0 || natural.height <= 0) return { width: 0, height: 0 };

  const scale = Math.min(
    area.width / natural.width,
    area.height / natural.height,
    1,
  );

  return {
    width: Math.max(0, natural.width * scale),
    height: Math.max(0, natural.height * scale),
  };
};

/**
 * The zoom, as a multiple of the fitted size, that shows the image at its own
 * size, one image pixel to one CSS pixel. A click zooms here, unless the image
 * is already about that size, when it doubles instead.
 */
export const actualZoom = (natural: Size, fitted: Size): number => {
  if (fitted.width <= 0) return 1;

  const zoom = natural.width / fitted.width;

  return zoom < zoomStep ? 2 : Math.min(zoom, zoomCeiling);
};

/** The furthest zoom in: twice the image's own size, so its pixels can be read */
export const maxZoom = (natural: Size, fitted: Size): number => {
  if (fitted.width <= 0) return 1;

  return Math.min(Math.max(2, (2 * natural.width) / fitted.width), zoomCeiling);
};

/** The zoom as a percentage of the image's own size, for the zoom label */
export const zoomPercent = (zoom: number, natural: Size, fitted: Size) =>
  natural.width > 0
    ? Math.round(((zoom * fitted.width) / natural.width) * 100)
    : 100;

/**
 * Keeps a zoomed image in view: it can be dragged until an edge meets the
 * matching edge of the viewport, and no further. On an axis where the image
 * is still smaller than the viewport it may sit anywhere between its place in
 * the image area and the viewport's centre, so it never jumps as it grows.
 *
 * `offset` is the image area's centre less the viewport's: the area is not
 * centred, since the bar above it is shorter than the space below it.
 */
export const clampPan = (
  pan: Point,
  zoom: number,
  fitted: Size,
  viewport: Size,
  offset: Point,
): Point => {
  const limit = (
    scaled: number,
    room: number,
    shift: number,
    value: number,
  ) => {
    const overflow = Math.max(0, (scaled - room) / 2);
    const low = Math.min(0, -overflow - shift);
    const high = Math.max(0, overflow - shift);

    return Math.min(high, Math.max(low, value));
  };

  return {
    x: limit(fitted.width * zoom, viewport.width, offset.x, pan.x),
    y: limit(fitted.height * zoom, viewport.height, offset.y, pan.y),
  };
};

/**
 * The pan that keeps the image point under `focus` in place while the zoom
 * changes from `zoom` to `nextZoom`, so zooming follows the cursor or the
 * fingers instead of the image's centre.
 */
export const panForZoom = (
  pan: Point,
  zoom: number,
  nextZoom: number,
  focus: Point,
): Point => {
  const ratio = nextZoom / zoom;

  return {
    x: focus.x - (focus.x - pan.x) * ratio,
    y: focus.y - (focus.y - pan.y) * ratio,
  };
};
