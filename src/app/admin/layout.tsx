import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Admin - Ryan Gan',
    template: '%s - Admin - Ryan Gan',
  },
  // Every admin page is behind sign-in, and none belongs in a search index.
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
