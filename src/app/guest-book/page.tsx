import { Button } from '@/components/ui/button';
import React from 'react';

export default function Page() {
  return (
    <main className="contentContainerPadding">
      <div className="mx-auto w-full max-w-3xl bg-red-200">
        <Button>Sign in to Guest Book</Button>
      </div>
    </main>
  );
}
