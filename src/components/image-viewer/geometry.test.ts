import { describe, expect, it } from 'vitest';

import {
  actualZoom,
  clampPan,
  fitSize,
  maxZoom,
  panForZoom,
  zoomPercent,
} from '@/components/image-viewer/geometry';

const landscape = { width: 1440, height: 900 };
const portrait = { width: 600, height: 1200 };

describe('fitSize', () => {
  it('fits the side that runs out of room first', () => {
    expect(fitSize(landscape, { width: 720, height: 720 })).toEqual({
      width: 720,
      height: 450,
    });
    expect(fitSize(portrait, { width: 720, height: 600 })).toEqual({
      width: 300,
      height: 600,
    });
  });

  it('never enlarges an image past its own size', () => {
    expect(fitSize({ width: 400, height: 300 }, landscape)).toEqual({
      width: 400,
      height: 300,
    });
  });

  it('shows nothing for an image with no size', () => {
    expect(fitSize({ width: 0, height: 0 }, landscape)).toEqual({
      width: 0,
      height: 0,
    });
  });
});

describe('actualZoom', () => {
  it('zooms to one image pixel per screen pixel', () => {
    expect(actualZoom(landscape, { width: 720, height: 450 })).toBe(2);
    expect(actualZoom(landscape, { width: 375, height: 234.375 })).toBe(3.84);
  });

  it('doubles an image already shown at about its own size', () => {
    expect(actualZoom(landscape, { width: 1200, height: 750 })).toBe(2);
    expect(actualZoom(landscape, landscape)).toBe(2);
  });

  it('stops at eight times the fitted size', () => {
    expect(
      actualZoom({ width: 9000, height: 100 }, { width: 300, height: 3 }),
    ).toBe(8);
  });
});

describe('maxZoom', () => {
  it('reaches twice the image size, at least twice the fitted size', () => {
    expect(maxZoom(landscape, { width: 720, height: 450 })).toBe(4);
    expect(maxZoom(landscape, landscape)).toBe(2);
  });

  it('stops at eight times the fitted size', () => {
    expect(maxZoom(landscape, { width: 160, height: 100 })).toBe(8);
  });
});

describe('zoomPercent', () => {
  it('reads the zoom against the image size, not the fitted size', () => {
    const fitted = { width: 720, height: 450 };

    expect(zoomPercent(1, landscape, fitted)).toBe(50);
    expect(zoomPercent(2, landscape, fitted)).toBe(100);
  });
});

describe('clampPan', () => {
  const fitted = { width: 400, height: 250 };
  const viewport = { width: 800, height: 600 };
  const centred = { x: 0, y: 0 };

  it('lets a zoomed image move until its edge meets the viewport edge', () => {
    // At 3x it is 1200 by 750: 200 and 75 over each side.
    expect(clampPan({ x: 500, y: -500 }, 3, fitted, viewport, centred)).toEqual(
      { x: 200, y: -75 },
    );
    expect(clampPan({ x: -50, y: 20 }, 3, fitted, viewport, centred)).toEqual({
      x: -50,
      y: 20,
    });
  });

  it('holds an image that still fits where it is', () => {
    expect(clampPan({ x: 30, y: 30 }, 1, fitted, viewport, centred)).toEqual(
      centred,
    );
  });

  it('lets an image off centre move as far as the viewport centre', () => {
    // The image area sits 40px above the viewport's centre.
    expect(
      clampPan({ x: 0, y: 100 }, 1, fitted, viewport, { x: 0, y: -40 }),
    ).toEqual({ x: 0, y: 40 });
    expect(
      clampPan({ x: 0, y: -100 }, 1, fitted, viewport, { x: 0, y: -40 }),
    ).toEqual({ x: 0, y: 0 });
  });
});

describe('panForZoom', () => {
  it('keeps the point under the focus still', () => {
    const focus = { x: 100, y: -50 };
    const pan = panForZoom({ x: 0, y: 0 }, 1, 2, focus);

    // The image point at the focus was 100, -50 from the image's centre; at
    // twice the size it is 200, -100 from it, which the pan brings back.
    expect(pan).toEqual({ x: -100, y: 50 });
    expect(panForZoom(pan, 2, 1, focus)).toEqual({ x: 0, y: 0 });
  });
});
