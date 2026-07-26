import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Inter, Luckiest_Guy, Newsreader } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
});

export const geistMono = GeistMono;
export const geistSans = GeistSans;

export const luckiestGuy = Luckiest_Guy({ subsets: ['latin'], weight: '400' });

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
