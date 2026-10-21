import { Metadata } from 'next';

import Contact from '@/components/contact/contact';
import PageSummary from '@/components/page-summary';
import BackButton from '@/components/navigation/back-button';
import { pageTitle, siteName } from '@/data/site';

const title = pageTitle('Connect');

const description =
  'Get in touch with a question, a project idea, or just to say hello.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/contact' },
  openGraph: {
    title,
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
