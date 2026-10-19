'use client';

import React, {
  useCallback,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  LuArrowUpRight,
  LuChevronLeft,
  LuChevronRight,
  LuX,
  LuZoomIn,
  LuZoomOut,
} from 'react-icons/lu';

import { cn } from '@/lib/utils';

import {
  actualZoom,
  clampPan,
  fitSize,
  maxZoom,
  panForZoom,
  type Point,
  type Size,
  zoomPercent,
  zoomStep,
} from './geometry';

export type ViewerImage = {
  /** The full-size file */
  src: string;
  alt: string;
  /** The copy already loaded on the page, shown until `src` arrives */
  preview?: string;
  /** The image's own size once known, else its shape */
  width: number;
  height: number;
};

type ImageViewerProps = {
  images: ViewerImage[];
  /** The page's image for each of `images`, to fly from and back to */
  triggers: HTMLElement[];
  initialIndex: number;
  onClose: () => void;
};

/** How far a finger has to travel before a press becomes a drag */
const dragThreshold = 8;

/** Two taps this close together, in time, are a double tap */
const doubleTapMs = 300;

/** Pulled down this far, or flicked down, the viewer closes */
const dismissDistance = 120;

/** Swiped sideways this far, or flicked, the next image shows */
const swipeDistance = 64;

/** Fast enough, in px per ms, to count as a flick */
const flickSpeed = 0.5;

/** The image area's offset before it is measured */
const centred: Point = { x: 0, y: 0 };

const flyDuration = 300;

const flyEasing = 'cubic-bezier(0.2, 0, 0, 1)';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isOnScreen = (rect: DOMRect) =>
  rect.width > 0 &&
  rect.bottom > 0 &&
  rect.top < window.innerHeight &&
  rect.right > 0 &&
  rect.left < window.innerWidth;

/** A pointer still down on the stage */
type Pointer = { x: number; y: number };

/** What the pointers down on the stage are doing */
type Gesture =
  | { kind: 'press'; start: Pointer; time: number; onImage: boolean }
  | { kind: 'pan'; start: Pointer; pan: Point }
  | { kind: 'swipe'; start: Pointer; time: number }
  | { kind: 'dismiss'; start: Pointer; time: number }
  | {
      kind: 'pinch';
      distance: number;
      middle: Pointer;
      zoom: number;
      pan: Point;
    };

/** A point on screen, from the viewport's centre */
const fromCentre = (x: number, y: number): Point => ({
  x: x - window.innerWidth / 2,
  y: y - window.innerHeight / 2,
});

const distanceBetween = (a: Pointer, b: Pointer) =>
  Math.hypot(a.x - b.x, a.y - b.y);

const middleOf = (a: Pointer, b: Pointer) => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

const iconButtonClassName =
  'flex size-11 shrink-0 items-center justify-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-300 disabled:pointer-events-none disabled:opacity-35';

/**
 * Screenshots full size, over the page: a dark, blurred overlay that is the
 * same in both themes, so a screenshot is always seen against one ground.
 *
 * It is a modal `<dialog>`, so the page behind is inert, focus stays inside,
 * and Escape closes it. The image flies from its place on the page and back
 * to it on close. Arrow keys, the side buttons, the thumbnail strip, and a
 * sideways swipe move between images; a click, a double tap, a pinch,
 * Ctrl+scroll (a trackpad pinch), or the zoom buttons zoom in, and a zoomed
 * image is dragged around. Pulling an unzoomed image down closes it.
 */
export default function ImageViewer({
  images,
  triggers,
  initialIndex,
  onClose,
}: ImageViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(initialIndex);
  const [natural, setNatural] = useState<Record<number, Size>>({});
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  const [area, setArea] = useState<{ size: Size; offset: Point } | null>(null);
  const [viewport, setViewport] = useState<Size>({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const [drag, setDrag] = useState<Point>({ x: 0, y: 0 });
  const [isGesturing, setIsGesturing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isCoarse, setIsCoarse] = useState(false);

  const pointers = useRef(new Map<number, Pointer>());
  const gesture = useRef<Gesture | null>(null);
  const lastTap = useRef<{ time: number; x: number; y: number } | null>(null);
  const tapTimer = useRef<number | undefined>(undefined);

  const count = images.length;
  const image = images[index];
  const imageSize = natural[index] ?? {
    width: image.width,
    height: image.height,
  };
  const fitted = area ? fitSize(imageSize, area.size) : imageSize;
  const isZoomed = zoom > 1;
  // The image at its own size on this screen: one image pixel to one device
  // pixel. A Retina screenshot shown at its CSS pixel size would be twice
  // that, a blur of doubled pixels rather than its real detail.
  // It only ever renders in the browser, once a reader clicks an image.
  const pixelRatio = window.devicePixelRatio || 1;
  const screenSize = {
    width: imageSize.width / pixelRatio,
    height: imageSize.height / pixelRatio,
  };
  const zoomLimit = maxZoom(screenSize, fitted);
  const isDismissing = drag.y > 0;

  // Open as a modal, keep the page still behind it, and give focus back to
  // the image the reader ends on, so the next Tab carries on from there.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const root = document.documentElement;
    const overflow = root.style.overflow;

    root.style.overflow = 'hidden';
    dialog.showModal();
    dialog.focus();

    return () => {
      root.style.overflow = overflow;
      if (dialog.open) dialog.close();
    };
  }, []);

  // The size of the image area, laid out by CSS (it knows the safe areas),
  // and where its centre sits from the viewport's.
  useLayoutEffect(() => {
    const element = areaRef.current;
    if (!element) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();

      setViewport({ width: window.innerWidth, height: window.innerHeight });
      setArea({
        size: { width: rect.width, height: rect.height },
        offset: {
          x: rect.left + rect.width / 2 - window.innerWidth / 2,
          y: rect.top + rect.height / 2 - window.innerHeight / 2,
        },
      });
      // A new window size changes the fit, so a zoom would point elsewhere.
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)');
    const update = () => setIsCoarse(query.matches);

    update();
    query.addEventListener('change', update);

    return () => query.removeEventListener('change', update);
  }, []);

  /**
   * Moves the image between the page and the viewer. `rect` is where it is
   * on the page; `toPage` flies there instead of from there. The fly layer
   * sits inside the zoomed and dragged frame, so its offset is divided by
   * the frame's scale to land in screen pixels.
   */
  const fly = useCallback((rect: DOMRect, toPage: boolean) => {
    const element = flyRef.current;
    const frame = element?.parentElement;
    if (!element || !frame) return undefined;

    const current = frame.getBoundingClientRect();
    if (current.width === 0) return undefined;

    const scale = current.width / element.offsetWidth;
    const x =
      (rect.left + rect.width / 2 - (current.left + current.width / 2)) / scale;
    const y =
      (rect.top + rect.height / 2 - (current.top + current.height / 2)) / scale;
    const page = `translate(${x}px, ${y}px) scale(${rect.width / current.width})`;
    const keyframes = toPage
      ? [{ transform: 'none' }, { transform: page }]
      : [{ transform: page }, { transform: 'none' }];

    return element.animate(keyframes, {
      duration: flyDuration,
      easing: flyEasing,
      fill: 'forwards',
    });
  }, []);

  // Fly in from the page, once the image area has been measured.
  const hasFlownIn = useRef(false);
  useLayoutEffect(() => {
    if (!area || hasFlownIn.current) return;
    hasFlownIn.current = true;

    const rect = triggers[initialIndex]?.getBoundingClientRect();
    if (rect && isOnScreen(rect) && !prefersReducedMotion()) fly(rect, false);
  }, [area, fly, initialIndex, triggers]);

  const close = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    window.clearTimeout(tapTimer.current);

    const trigger = triggers[index];

    // Bring the image the reader ended on into view, so the viewer closes
    // onto it rather than onto the one it opened from.
    if (trigger && !isOnScreen(trigger.getBoundingClientRect())) {
      trigger.scrollIntoView({ block: 'center', behavior: 'instant' });
    }

    const rect = trigger?.getBoundingClientRect();
    const animation =
      rect && isOnScreen(rect) && !prefersReducedMotion()
        ? fly(rect, true)
        : undefined;

    const finish = () => {
      dialogRef.current?.close();
      trigger?.focus({ preventScroll: true });
      onClose();
    };

    if (animation) animation.finished.then(finish, finish);
    else window.setTimeout(finish, prefersReducedMotion() ? 0 : 150);
  }, [fly, index, isClosing, onClose, triggers]);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const show = useCallback(
    (next: number, from: 'left' | 'right' | null = null) => {
      const target = (next + count) % count;
      if (target === index) return;

      setIndex(target);
      resetZoom();
      setDrag({ x: 0, y: 0 });

      const element = flyRef.current;
      if (element && from && !prefersReducedMotion()) {
        const x = from === 'right' ? 40 : -40;
        element.animate(
          [
            { transform: `translateX(${x}px)`, opacity: 0 },
            { transform: 'none', opacity: 1 },
          ],
          { duration: 200, easing: flyEasing },
        );
      }
    },
    [count, index, resetZoom],
  );

  const previous = useCallback(() => show(index - 1, 'left'), [index, show]);
  const next = useCallback(() => show(index + 1, 'right'), [index, show]);

  const offset = area?.offset ?? centred;

  /** Zooms to `target`, keeping the point `focus` (from the viewport's centre) still */
  const zoomTo = (target: number, focus: Point = { x: 0, y: 0 }) => {
    const nextZoom = Math.min(zoomLimit, Math.max(1, target));

    if (nextZoom <= 1.01) {
      resetZoom();
      return;
    }

    // `focus` is from the viewport's centre; the pan is from the image
    // area's, where the image sits unzoomed.
    const local = { x: focus.x - offset.x, y: focus.y - offset.y };

    setZoom(nextZoom);
    setPan(
      clampPan(
        panForZoom(pan, zoom, nextZoom, local),
        nextZoom,
        fitted,
        viewport,
        offset,
      ),
    );
  };

  /** A click or double tap: zoom in to the image's own size there, or back to fit */
  const toggleZoom = (x: number, y: number) => {
    if (isZoomed) resetZoom();
    else zoomTo(actualZoom(screenSize, fitted), fromCentre(x, y));
  };

  // Ctrl+scroll is how a trackpad pinch arrives; plain scroll pans a zoomed
  // image. React's wheel listener is passive, so this one is added by hand
  // to stop the page from zooming.
  const stageRef = useRef<HTMLDivElement>(null);

  const onWheel = useEffectEvent((event: WheelEvent) => {
    event.preventDefault();

    if (event.ctrlKey) {
      zoomTo(
        zoom * Math.exp(-event.deltaY * 0.01),
        fromCentre(event.clientX, event.clientY),
      );
    } else if (isZoomed) {
      setPan(
        clampPan(
          { x: pan.x - event.deltaX, y: pan.y - event.deltaY },
          zoom,
          fitted,
          viewport,
          offset,
        ),
      );
    }
  });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    stage.addEventListener('wheel', onWheel, { passive: false });

    return () => stage.removeEventListener('wheel', onWheel);
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isClosing || event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    const [a, b] = Array.from(pointers.current.values());

    if (b) {
      gesture.current = {
        kind: 'pinch',
        distance: distanceBetween(a, b),
        middle: middleOf(a, b),
        zoom,
        pan,
      };
      setDrag({ x: 0, y: 0 });
    } else {
      // Read now: once the stage captures the pointer, every later event
      // targets the stage itself.
      const onImage = Boolean(
        (event.target as HTMLElement).closest('[data-viewer-frame]'),
      );

      gesture.current = {
        kind: 'press',
        start: a,
        time: event.timeStamp,
        onImage,
      };
    }

    setIsGesturing(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;

    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    const current = gesture.current;
    if (!current) return;

    if (current.kind === 'pinch') {
      const [a, b] = Array.from(pointers.current.values());
      if (!a || !b) return;

      const middle = middleOf(a, b);
      const nextZoom = Math.min(
        zoomLimit,
        Math.max(1, (current.zoom * distanceBetween(a, b)) / current.distance),
      );
      const focus = fromCentre(current.middle.x, current.middle.y);
      const local = { x: focus.x - offset.x, y: focus.y - offset.y };
      const zoomed = panForZoom(current.pan, current.zoom, nextZoom, local);

      setZoom(nextZoom);
      setPan(
        clampPan(
          {
            x: zoomed.x + middle.x - current.middle.x,
            y: zoomed.y + middle.y - current.middle.y,
          },
          nextZoom,
          fitted,
          viewport,
          offset,
        ),
      );
      return;
    }

    const point = { x: event.clientX, y: event.clientY };

    if (current.kind === 'press') {
      const dx = point.x - current.start.x;
      const dy = point.y - current.start.y;
      if (Math.hypot(dx, dy) < dragThreshold) return;

      // A zoomed image is dragged around by any pointer. Unzoomed, only a
      // finger swipes between images or pulls the viewer closed; a mouse
      // dragging there is not asking for either.
      if (isZoomed) {
        gesture.current = { kind: 'pan', start: current.start, pan };
      } else if (event.pointerType === 'mouse') {
        gesture.current = null;
        return;
      } else if (Math.abs(dx) > Math.abs(dy) && count > 1) {
        gesture.current = { ...current, kind: 'swipe' };
      } else if (dy > 0) {
        gesture.current = { ...current, kind: 'dismiss' };
      } else {
        gesture.current = null;
        return;
      }
    }

    const active = gesture.current;
    if (!active || active.kind === 'press' || active.kind === 'pinch') return;

    const dx = point.x - active.start.x;
    const dy = point.y - active.start.y;

    if (active.kind === 'pan') {
      setPan(
        clampPan(
          { x: active.pan.x + dx, y: active.pan.y + dy },
          zoom,
          fitted,
          viewport,
          offset,
        ),
      );
    } else if (active.kind === 'swipe') {
      setDrag({ x: dx, y: 0 });
    } else {
      setDrag({ x: dx * 0.4, y: Math.max(0, dy) });
    }
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.delete(event.pointerId);

    const current = gesture.current;
    const remaining = Array.from(pointers.current.values());

    // Lifting one finger of a pinch carries on as a drag with the other.
    if (current?.kind === 'pinch') {
      gesture.current = remaining[0]
        ? { kind: 'pan', start: remaining[0], pan }
        : null;
      if (!remaining[0]) setIsGesturing(false);
      return;
    }

    gesture.current = null;
    setIsGesturing(false);
    if (event.type === 'pointercancel' || !current) {
      setDrag({ x: 0, y: 0 });
      return;
    }

    const elapsed = Math.max(
      1,
      event.timeStamp - ('time' in current ? current.time : 0),
    );

    if (current.kind === 'swipe') {
      const dx = event.clientX - current.start.x;
      setDrag({ x: 0, y: 0 });

      if (Math.abs(dx) > swipeDistance || Math.abs(dx) / elapsed > flickSpeed) {
        if (dx < 0) next();
        else previous();
      }
      return;
    }

    if (current.kind === 'dismiss') {
      const dy = event.clientY - current.start.y;

      if (dy > dismissDistance || dy / elapsed > flickSpeed) close();
      else setDrag({ x: 0, y: 0 });
      return;
    }

    if (current.kind !== 'press') return;

    // A tap. On the image it zooms: a click with a mouse, a double tap with
    // a finger, so a single tap is free to do nothing. Off the image, on the
    // overlay, it closes the viewer.
    const { onImage } = current;
    const { clientX: x, clientY: y } = event;

    if (event.pointerType === 'mouse') {
      if (onImage) toggleZoom(x, y);
      else if (!isZoomed) close();
      return;
    }

    const previousTap = lastTap.current;
    const isDouble =
      previousTap &&
      event.timeStamp - previousTap.time < doubleTapMs &&
      Math.hypot(x - previousTap.x, y - previousTap.y) < 32;

    window.clearTimeout(tapTimer.current);

    if (isDouble) {
      lastTap.current = null;
      toggleZoom(x, y);
    } else {
      lastTap.current = { time: event.timeStamp, x, y };
      if (!onImage && !isZoomed) {
        tapTimer.current = window.setTimeout(close, doubleTapMs);
      }
    }
  };

  // Escape is handled on keydown, which stops the browser's own close
  // request: Chrome closes a dialog outright, skipping `cancel`, when one
  // cancel was prevented and the reader has not clicked since. Other close
  // requests, like Android's back gesture, still arrive as `cancel`.
  const onCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    close();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const actions: Record<string, () => void> = {
      Escape: close,
      ArrowLeft: previous,
      ArrowRight: next,
      '+': () => zoomTo(zoom * zoomStep),
      '=': () => zoomTo(zoom * zoomStep),
      '-': () => zoomTo(zoom / zoomStep),
      '0': resetZoom,
    };
    const action = actions[event.key];

    if (action && (count > 1 || !event.key.startsWith('Arrow'))) {
      event.preventDefault();
      action();
    }
  };

  // Load the images either side, so moving to them is instant.
  useEffect(() => {
    if (count < 2) return;

    for (const neighbour of [index - 1, index + 1]) {
      const preload = new window.Image();
      preload.src = images[(neighbour + count) % count].src;
    }
  }, [count, images, index]);

  const percent = natural[index]
    ? `${zoomPercent(zoom, screenSize, fitted)}%`
    : 'Fit';
  const dismissProgress = Math.min(1, drag.y / (dismissDistance * 3));
  const hasChrome = !isZoomed && !isDismissing;
  const frameTransform = `translate(${pan.x + drag.x}px, ${pan.y + drag.y}px) scale(${zoom * (1 - dismissProgress * 0.3)})`;
  const fadeClassName = cn(
    'transition-opacity duration-200',
    hasChrome ? 'opacity-100' : 'pointer-events-none opacity-0',
  );

  return (
    <dialog
      ref={dialogRef}
      aria-label={count > 1 ? 'Screenshots' : image.alt || 'Image'}
      tabIndex={-1}
      onCancel={onCancel}
      // Should the browser close the dialog itself, the viewer still goes.
      // `close` is queued, so by the time it arrives a dialog closed and
      // shown again, as Strict Mode does to effects, is open once more.
      onClose={(event) => {
        if (!event.currentTarget.open) onClose();
      }}
      onKeyDown={onKeyDown}
      className={cn(
        'not-prose fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-transparent p-0 font-sans text-neutral-200 outline-none backdrop:bg-transparent',
        'transition-opacity duration-200 starting:opacity-0',
        isClosing && 'opacity-0 delay-100',
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[rgb(10_10_10/0.84)] backdrop-blur-[10px]"
        style={{ opacity: 1 - dismissProgress }}
      />

      {/* Gestures land here, under the controls and over the backdrop */}
      <div
        ref={stageRef}
        className={cn(
          'absolute inset-0 touch-none select-none',
          isZoomed && (isGesturing ? 'cursor-grabbing' : 'cursor-grab'),
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* The space an unzoomed image fits in; CSS sizes it */}
        <div
          ref={areaRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[calc(3.5rem+env(safe-area-inset-top))] bottom-[calc(6rem+env(safe-area-inset-bottom))] md:inset-x-24 md:top-16 md:bottom-[var(--viewer-bottom)]"
          style={
            {
              '--viewer-bottom': count > 1 ? '9.5rem' : '3.5rem',
            } as React.CSSProperties
          }
        />

        {area && (
          <div
            data-viewer-frame
            className={cn(
              'absolute top-1/2 left-1/2',
              isZoomed ? 'cursor-[inherit]' : 'cursor-zoom-in',
              !isGesturing && 'transition-transform duration-250 ease-out',
            )}
            style={{
              width: fitted.width,
              height: fitted.height,
              marginLeft: -fitted.width / 2 + offset.x,
              marginTop: -fitted.height / 2 + offset.y,
              transform: frameTransform,
            }}
          >
            <div ref={flyRef} className="relative size-full">
              {image.preview && !loaded[index] && (
                // eslint-disable-next-line @next/next/no-img-element -- the page's own copy, already decoded, standing in while `src` loads
                <img
                  src={image.preview}
                  alt=""
                  draggable={false}
                  className={cn(
                    'absolute inset-0 size-full',
                    !isZoomed && 'rounded-md',
                  )}
                />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element -- the original file, untouched: zooming to 100% means its real pixels. ImageKit already serves it as WebP or AVIF. */}
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                draggable={false}
                onLoad={(event) => {
                  const { naturalWidth, naturalHeight } = event.currentTarget;
                  const loadedIndex = index;

                  setNatural((sizes) => ({
                    ...sizes,
                    [loadedIndex]: {
                      width: naturalWidth,
                      height: naturalHeight,
                    },
                  }));
                  setLoaded((all) => ({ ...all, [loadedIndex]: true }));
                }}
                className={cn(
                  'absolute inset-0 size-full transition-opacity duration-200',
                  !isZoomed && 'rounded-md',
                  loaded[index] || !image.preview ? 'opacity-100' : 'opacity-0',
                )}
              />
            </div>
          </div>
        )}

        {area && (
          <p
            className={cn(
              fadeClassName,
              'absolute inset-x-24 m-0 hidden truncate text-center text-sm leading-5 text-neutral-300 md:block',
            )}
            style={{
              top: `calc(50% + ${offset.y + fitted.height / 2 + 16}px)`,
            }}
          >
            {image.alt}
          </p>
        )}
      </div>

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-linear-to-b from-[rgb(10_10_10/0.7)] to-transparent pt-[env(safe-area-inset-top)]">
        <div className="pointer-events-auto grid h-14 grid-cols-[auto_1fr_auto] items-center px-2 md:hidden">
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className={iconButtonClassName}
          >
            <LuX size={20} />
          </button>
          <span className="text-center text-sm leading-5 text-neutral-300 tabular-nums">
            {count > 1 && `${index + 1} / ${count}`}
          </span>
          <a
            href={image.src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the original in a new tab"
            className={iconButtonClassName}
          >
            <LuArrowUpRight size={20} />
          </a>
        </div>

        <div className="pointer-events-auto hidden h-16 items-center justify-between pr-4 pl-6 md:flex">
          <span className="text-sm leading-5 text-neutral-300 tabular-nums">
            {count > 1 && `${index + 1} / ${count}`}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Zoom out"
              disabled={!isZoomed}
              onClick={() => zoomTo(zoom / zoomStep)}
              className={iconButtonClassName}
            >
              <LuZoomOut size={18} />
            </button>
            <button
              type="button"
              aria-label="Zoom to fit"
              onClick={resetZoom}
              className="h-7 min-w-14 rounded-full bg-white/12 px-2.5 text-[13px] leading-5 text-neutral-300 tabular-nums transition-colors hover:bg-white/18 hover:text-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-300"
            >
              {percent}
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              disabled={zoom >= zoomLimit - 0.01}
              onClick={() => zoomTo(zoom * zoomStep)}
              className={iconButtonClassName}
            >
              <LuZoomIn size={18} />
            </button>
            <span aria-hidden className="mx-1.5 h-5 w-px bg-white/16" />
            <a
              href={image.src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the original in a new tab"
              className={iconButtonClassName}
            >
              <LuArrowUpRight size={18} />
            </a>
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className={iconButtonClassName}
            >
              <LuX size={18} />
            </button>
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={previous}
            className={cn(
              fadeClassName,
              iconButtonClassName,
              'absolute top-1/2 left-6 hidden -translate-y-1/2 bg-white/8 md:flex',
            )}
          >
            <LuChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={next}
            className={cn(
              fadeClassName,
              iconButtonClassName,
              'absolute top-1/2 right-6 hidden -translate-y-1/2 bg-white/8 md:flex',
            )}
          >
            <LuChevronRight size={18} />
          </button>

          <div
            className={cn(
              fadeClassName,
              'absolute inset-x-6 bottom-0 hidden h-28 items-center justify-center-safe gap-2.5 overflow-x-auto md:flex',
            )}
          >
            {images.map((thumbnail, thumbnailIndex) => (
              <button
                key={thumbnail.src + thumbnailIndex}
                type="button"
                aria-label={`Show ${thumbnail.alt || `image ${thumbnailIndex + 1}`}`}
                aria-current={thumbnailIndex === index}
                onClick={() => show(thumbnailIndex)}
                className={cn(
                  'h-12 shrink-0 overflow-hidden rounded-sm bg-white/8 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-300',
                  thumbnailIndex === index
                    ? 'opacity-100 outline-2 outline-offset-2 outline-neutral-50'
                    : 'opacity-45',
                )}
                style={{
                  aspectRatio: `${thumbnail.width} / ${thumbnail.height}`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- the page's own copy, already loaded */}
                <img
                  src={thumbnail.preview ?? thumbnail.src}
                  alt=""
                  draggable={false}
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Below the image on a phone: its caption, and where it is in the set */}
      <div
        className={cn(
          fadeClassName,
          'pointer-events-none absolute inset-x-6 bottom-[calc(1rem+env(safe-area-inset-bottom))] flex flex-col items-center gap-3.5 md:hidden',
        )}
      >
        <p className="m-0 line-clamp-2 text-center text-[15px] leading-6 text-neutral-300">
          {image.alt}
        </p>
        {count > 1 && count <= 12 && (
          <div aria-hidden className="flex gap-1.5">
            {images.map((dot, dotIndex) => (
              <span
                key={dot.src + dotIndex}
                className={cn(
                  'size-1.5 rounded-full',
                  dotIndex === index ? 'bg-neutral-50' : 'bg-white/30',
                )}
              />
            ))}
          </div>
        )}
      </div>

      <p
        aria-hidden
        className={cn(
          'pointer-events-none absolute bottom-[calc(2rem+env(safe-area-inset-bottom))] left-1/2 m-0 -translate-x-1/2 rounded-full bg-[rgb(10_10_10/0.8)] px-3.5 py-2 text-[13px] leading-5 whitespace-nowrap text-neutral-300 transition-opacity duration-200',
          isZoomed && !isGesturing ? 'opacity-100' : 'opacity-0',
        )}
      >
        {isCoarse
          ? 'Drag to move - double-tap to fit'
          : 'Drag to move - click to fit'}
      </p>
    </dialog>
  );
}
