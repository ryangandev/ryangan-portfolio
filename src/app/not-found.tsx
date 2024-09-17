import React from 'react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <main className="flex flex-col items-center justify-center space-y-4">
      <h2>404 - Not Found</h2>
      <Link href="/">
        <h4 className="text-blue-600 underline dark:text-blue-400">
          Return Home
        </h4>
      </Link>
    </main>
  );
};

export default NotFound;
