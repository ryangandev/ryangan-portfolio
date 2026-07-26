import { GeistSans } from 'geist/font/sans';
import { Newsreader } from 'next/font/google';

export const geistSans = GeistSans;

// `style` has to be set explicitly. next/font bakes the style into the
// generated class, and because that class is unlayered and emitted after
// Tailwind's utilities it wins on source order — so with the default
// (`normal`) the `italic` utility silently does nothing.
//
// Italic only: the sole use of this font is the italic tagline on the home
// page, and next/font preloads every style it is given, so including 'normal'
// ships ~58KB that nothing ever renders. Add 'normal' back if upright
// Newsreader is ever needed.
export const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['italic'],
});

// Only declare a face here if something actually renders it. Anything in this
// module is instantiated on every route, since `layout.tsx` imports it.
//
// Moving a face to its point of use does not localise the cost: Turbopack
// merges every next/font stylesheet into one shared CSS chunk, so a face is
// preloaded on any route that loads that chunk — which is all of them.
// `GeistMono` is imported directly by `components/mdx/custom-code.tsx` and is
// still preloaded on the home page, which renders no code blocks. Dropping a
// face from the payload therefore means removing its last import, not
// relocating it.
