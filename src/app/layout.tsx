import NavBar from '@/components/navbar';
import './globals.css';
import type { Metadata } from 'next';
import { inter } from '@/assets/fonts';

import Footer from '@/components/footer';
import { Toaster } from 'react-hot-toast';
import BackToTopButton from '@/components/back-to-top-btn';
import { AppProviders } from '@/providers/app-providers';

export const metadata: Metadata = {
  title: 'Ryan Gan | Software Engineer',
  description: 'My name is Ryan Gan and I am a Software Engineer.',
};

export default function RootLayout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.className} relative text-gray-950 dark:text-gray-50 dark:text-opacity-90`}
      >
        <AppProviders>
          <NavBar />
          <main
            className="pt-16"
            style={{
              minHeight: 'calc(100vh - 130px)',
            }}
          >
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-right" />
          <BackToTopButton />
        </AppProviders>
      </body>
    </html>
  );
}
