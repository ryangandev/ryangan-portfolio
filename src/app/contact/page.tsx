import { Metadata } from 'next';

import Contact from '@/components/contact/contact';
import PageSummary from '@/components/page-summary';

export const metadata: Metadata = {
  title: 'Contact - Ryan Gan',
};

export default function Page() {
  return (
    <main className="">
      <PageSummary>
        I&apos;d love to hear from you! Whether you have a question, a project
        idea, or just want to say hello, feel free to get in touch.
      </PageSummary>
      <Contact />
    </main>
  );
}
