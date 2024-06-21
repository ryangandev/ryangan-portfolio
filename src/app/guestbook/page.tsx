import SectionHeader from '@/components/section-header';
import { Button } from '@/components/ui/button';
import React from 'react';
import { FaGithub } from 'react-icons/fa';

export default function Page() {
  return (
    <main className="contentContainerPadding">
      <div className="mx-auto w-full max-w-2xl">
        <SectionHeader section="Sign My Guestbook" />
        <Button size="sm" className="space-x-2" variant="default">
          <FaGithub size={18} />
          <span>Sign in with GitHub</span>
        </Button>
      </div>
    </main>
  );
}
