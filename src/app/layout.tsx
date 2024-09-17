import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/react';

import { geistSans } from '@/assets/fonts';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-screen flex-col antialiased selection:bg-zinc-300 selection:text-zinc-950 dark:selection:bg-zinc-700 dark:selection:text-zinc-50',
          geistSans.className,
        )}
      >
        <AppProviders>
          <SiteHeader />
          <div className="color-level-1 relative mx-auto flex max-w-[692px] flex-grow px-6 py-16 md:py-32">
            {children}
          </div>
          <SiteFooter />
          <Analytics />
          <Toaster richColors />
          <BackToTopButton />
        </AppProviders>
      </body>
    </html>
  );
}
