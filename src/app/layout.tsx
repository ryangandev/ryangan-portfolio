import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';

import { poppins } from '@/assets/fonts';
import BackToTopButton from '@/components/back-to-top-btn';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { auth } from '@/libs/auth';
import { AppProviders } from '@/providers/app-providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ryan Gan | Software Engineer',
  description: 'My name is Ryan Gan and I am a Software Engineer.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${poppins.className} relative text-gray-950 antialiased dark:text-gray-50 dark:text-opacity-90`}
      >
        {/* for client side useSession */}
        <SessionProvider session={session}>
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
            <Toaster />
            <BackToTopButton />
          </AppProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
