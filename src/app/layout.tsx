import type { Metadata } from 'next';

import { ViewTransitions } from 'next-view-transitions';
import { Analytics } from '@vercel/analytics/next';

import { geistSans } from '@/assets/fonts';
import SiteFooter from '@/components/site-footer';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { AppProviders } from '@/providers/app-providers';
import '@/styles/globals.css';

const title = 'Ryan Gan | Software Engineer';
const description = 'My name is Ryan Gan and I am a Software Engineer.';

export const metadata: Metadata = {
  // Required for `opengraph-image.png` to resolve to an absolute URL.
  metadataBase: new URL('https://ryangan.me'),
  title,
  description,
  openGraph: {
    title,
    description,
    url: '/',
    siteName: 'Ryan Gan',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        className="scroll-smooth"
        data-scroll-behavior="smooth"
        suppressHydrationWarning
      >
        <body
          className={cn(
            'flex min-h-screen flex-col color-level-3 antialiased selection:bg-zinc-300 selection:text-zinc-950 dark:selection:bg-zinc-700 dark:selection:text-zinc-50',
            geistSans.className,
          )}
        >
          <AppProviders>
            <div className="relative mx-auto w-full max-w-[692px] grow px-6 py-16 md:pt-32">
              {children}
            </div>
            <SiteFooter />
            <Analytics />
            <Toaster richColors />
          </AppProviders>
        </body>
      </html>
    </ViewTransitions>
  );
}
