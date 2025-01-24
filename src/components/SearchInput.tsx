import React, { useState } from 'react';
import { SearchIcon } from '@heroicons/react/outline';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        id="search-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search events... (Ctrl + K)"
        className="w-full bg-dark-accent/50 text-white placeholder-dark-muted rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <SearchIcon className="w-5 h-5 text-dark-muted absolute left-3 top-1/2 transform -translate-y-1/2" />
    </form>
  );
};

export default SearchInput; 