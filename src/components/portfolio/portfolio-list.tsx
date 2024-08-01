'use client';

import { useState } from 'react';

import Search from '@/components/search';

const PortfolioList = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <section>
      <Search
        placeholder="Search for projects..."
        setSearchTerm={setSearchTerm}
      />
    </section>
  );
};

export default PortfolioList;
