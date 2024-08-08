import type { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';

import { inter } from '@/assets/fonts';
import BackToTopButton from '@/components/back-to-top-btn';
import Footer from '@/components/footer';
import Header from '@/components/header';
import { Toaster } from '@/components/ui/sonner';
import { auth } from '@/libs/auth';
import { AppProviders } from '@/providers/app-providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ryan Gan | Software Engineer',
  description: 'My name is Ryan Gan and I am a Software Engineer.',
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.className} relative text-gray-950 antialiased dark:text-gray-50 dark:text-opacity-90`}
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
            <Toaster richColors />
            <BackToTopButton />
          </AppProviders>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
