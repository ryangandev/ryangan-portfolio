import type { Metadata } from 'next';

import { SessionProvider } from 'next-auth/react';

import { fontSans } from '@/assets/fonts';
import BackToTopButton from '@/components/back-to-top-btn';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { Toaster } from '@/components/ui/sonner';
import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { AppProviders } from '@/providers/app-providers';
import '@/styles/globals.css';

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
        className={cn('bg-background font-sans antialiased', fontSans.variable)}
      >
        {/* for client side useSession */}
        <SessionProvider session={session}>
          <AppProviders>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-grow pt-16">{children}</main>
              <SiteFooter />
            </div>
            <Toaster richColors />
            <BackToTopButton />
          </AppProviders>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
