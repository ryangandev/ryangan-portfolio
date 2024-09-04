import type { Metadata } from 'next';

import { fontSans } from '@/assets/fonts';
import BackToTopButton from '@/components/back-to-top-btn';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import { Toaster } from '@/components/ui/sonner';
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
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={cn('bg-background font-sans antialiased', fontSans.variable)}
      >
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-grow pt-16">{children}</main>
            <SiteFooter />
          </div>
          <Toaster richColors />
          <BackToTopButton />
        </AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;
