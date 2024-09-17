'use client';

import { useState } from 'react';

import Search from '@/components/search';

const BlogList = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <section>
      <Search placeholder="Search for posts..." setSearchTerm={setSearchTerm} />
    </section>
  );
};

export default BlogList;
