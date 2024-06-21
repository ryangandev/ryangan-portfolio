import Contact from '@/components/contact';
import SectionHeader from '@/components/section-header';

import React from 'react';

export default function Page() {
  return (
    <main className="contentContainerPadding">
      <div className="mx-auto w-full max-w-2xl border-border">
        <SectionHeader section="Get in touch" />
        <Contact />
      </div>
    </main>
  );
}
