import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';

import { inter } from '@/assets/fonts';
import BackToTopButton from '@/components/back-to-top-btn';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { AppProviders } from '@/providers/app-providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ryan Gan | Software Engineer',
  description: 'My name is Ryan Gan and I am a Software Engineer.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.className} relative text-gray-950 antialiased dark:text-gray-50 dark:text-opacity-90`}
      >
        <AppProviders>
          <Header />
          <main
            className="pt-16"
            style={{
              minHeight: 'calc(100vh - 81px)',
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
