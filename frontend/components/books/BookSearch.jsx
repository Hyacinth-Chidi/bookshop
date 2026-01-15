/**
 * ============================================
 * BOOK SEARCH COMPONENT
 * ============================================
 * Search bar with auto-complete
 */

'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function BookSearch({ onSearch, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-neutral-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by book name or course code..."
          className="w-full pl-12 pr-12 py-3 bg-white text-neutral-900 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-neutral-900"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  );
}