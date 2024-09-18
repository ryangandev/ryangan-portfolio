import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/react';

import { geistSans } from '@/assets/fonts';
import SiteFooter from '@/components/site-footer';
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
          'color-level-1 flex min-h-screen flex-col antialiased selection:bg-zinc-300 selection:text-zinc-950 dark:selection:bg-zinc-700 dark:selection:text-zinc-50',
          geistSans.className,
        )}
      >
        <AppProviders>
          <div className="relative mx-auto flex max-w-[692px] flex-grow px-6 py-16 md:pt-32">
            {children}
          </div>
          <SiteFooter />
          <Analytics />
          <Toaster richColors />
        </AppProviders>
      </body>
    </html>
  );
}
