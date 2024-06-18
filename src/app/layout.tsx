import NavBar from '@/components/navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Footer from '@/components/footer';
import { Toaster } from 'react-hot-toast';
import BackToTopButton from '@/components/back-to-top-btn';
import { AppProviders } from '@/providers/app-providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ryan Gan | Software Engineer',
  description: 'My name is Ryan Gan and I am a Software Engineer.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.className} relative bg-gray-50 pb-10 pt-28 text-gray-950 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90`}
      >
        <AppProviders>
          <NavBar />
          {children}
          <Footer />
          <Toaster position="top-right" />
          <BackToTopButton />
        </AppProviders>
      </body>
    </html>
  );
}
