import React from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Input } from './ui/input';

type SearchProps = {
  placeholder?: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const Search = ({ placeholder, setSearchTerm }: SearchProps) => {
  return (
    <div className="relative">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
      <Input
        className="pl-10"
        placeholder={placeholder || 'Search...'}
        onChange={(e) => setSearchTerm(e.target.value)}
        type="text"
      />
    </div>
  );
};

export default Search;
