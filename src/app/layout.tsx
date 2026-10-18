import { ViewTransition } from 'react';
import type { Metadata } from 'next';

import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { geistSans } from '@/assets/fonts';
import BackToTop from '@/components/back-to-top';
import SiteFooter from '@/components/site-footer';
import { Toaster } from '@/components/ui/sonner';
import {
  feedAlternates,
  siteDescription,
  siteName,
  siteTitle,
  siteUrl,
} from '@/data/site';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';

export const metadata: Metadata = {
  // Required for `opengraph-image.png` and every relative `openGraph.url` on a
  // nested page to resolve to an absolute URL.
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: '/',
    ...feedAlternates,
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: '/',
    siteName,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // No `scroll-smooth` here: it would animate Back and Forward too. Links
    // within a page scroll smoothly by themselves; see `in-page-link.tsx`.
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-screen flex-col color-level-3 antialiased selection:bg-neutral-300 selection:text-neutral-950 dark:selection:bg-neutral-700 dark:selection:text-neutral-50',
          geistSans.className,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="rg-theme"
          disableTransitionOnChange
        >
          <div className="relative mx-auto w-full max-w-[692px] grow px-6 py-16 md:pt-32">
            <ViewTransition>{children}</ViewTransition>
          </div>
          <SiteFooter />
          <BackToTop />
          <Analytics />
          <SpeedInsights />
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
