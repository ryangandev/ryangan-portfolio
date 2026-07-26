import { Metadata } from 'next';

import Contact from '@/components/contact/contact';
import PageSummary from '@/components/page-summary';
import BackButton from '@/components/navigation/back-button';
import { siteName } from '@/data/site';

const description =
  'Get in touch — a question, a project idea, or just to say hello.';

export const metadata: Metadata = {
  title: 'Contact - Ryan Gan',
  description,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact - Ryan Gan',
    description,
    url: '/contact',
    siteName,
    locale: 'en_US',
    type: 'website',
  },
};

export default function Page() {
  return (
    <main className="relative">
      <BackButton name="Home" href="/" />
      <h1>Connect</h1>
      <PageSummary>
        I&apos;d love to hear from you! Whether you have a question, a project
        idea, or just want to say hello, feel free to get in touch.
      </PageSummary>
      <Contact />
    </main>
  );
}
