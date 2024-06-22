import Contact from '@/components/contact-form';
import PageSummary from '@/components/page-summary';
import SectionHeader from '@/components/section-header';

export default function Page() {
  return (
    <main className="contentContainerPadding">
      <div className="mx-auto w-full max-w-3xl border-border">
        <SectionHeader section="Get in touch" />
        <PageSummary
          content={[
            "I'd love to hear from you!",
            'Whether you have a question, a project idea, or just want to say hello, feel free to get in touch.',
          ]}
        />
        <Contact />
      </div>
    </main>
  );
}
