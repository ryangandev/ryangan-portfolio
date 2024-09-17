import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Inter, Luckiest_Guy } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
});

export const geistMono = GeistMono;
export const geistSans = GeistSans;

export const luckiestGuy = Luckiest_Guy({ subsets: ['latin'], weight: '400' });
