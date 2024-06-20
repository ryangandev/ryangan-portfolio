import React from 'react';

export default function Footer() {
  const getYear = () => new Date().getFullYear();

  return (
    <footer className="z-50 mx-auto w-full max-w-screen-xl px-6 text-gray-500 md:px-20">
      <div className="flex w-full flex-col items-center border-t py-6">
        <small className="mb-2 block text-xs">
          &copy; {getYear()} Ryan Gan. All rights reserved.
        </small>
        <p className="text-xs">
          <span className="font-semibold">About this website:</span> built with
          React & Next.js (App Router & Server Actions), TypeScript, Tailwind
          CSS, Shadcn UI, Framer Motion, React Email & Resend, Deployed to
          Vercel.
        </p>
      </div>
    </footer>
  );
}
