import { Inter as FontSans, Luckiest_Guy, Poppins } from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const luckiestGuy = Luckiest_Guy({ subsets: ['latin'], weight: '400' });

export const poppins = Poppins({ subsets: ['latin'], weight: '400' });
