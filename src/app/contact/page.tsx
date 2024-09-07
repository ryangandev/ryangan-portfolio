import { Metadata } from 'next';

import Contact from '@/components/contact/contact';
import Heading from '@/components/heading';
import PageSummary from '@/components/page-summary';

export const metadata: Metadata = {
  title: 'Contact - Ryan Gan',
};

const Page = () => {
  return (
    <main className="contentContainerPadding">
      <div className="mx-auto w-full max-w-2xl border-border">
        <Heading shadowed>Get in touch</Heading>
        <PageSummary>
          I&apos;d love to hear from you! Whether you have a question, a project
          idea, or just want to say hello, feel free to get in touch.
        </PageSummary>
        <Contact />
      </div>
    </main>
  );
};

export default Page;
