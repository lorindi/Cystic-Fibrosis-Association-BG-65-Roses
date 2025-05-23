'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface SearchBarProps {
  initialValue?: string;
  onSearch: (query: string) => void;
  selectedCategory: string | null; // For backward compatibility
}

export default function SearchBar({ initialValue = '', onSearch, selectedCategory }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState(initialValue);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
    
    // Update URL parameters
    const params = new URLSearchParams(window.location.search);
    if (searchValue) {
      params.set('q', searchValue);
    } else {
      params.delete('q');
    }
    
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
    
    // Remove q parameter from URL, preserve other parameters
    const params = new URLSearchParams(window.location.search);
    params.delete('q');
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            className="w-full py-2 px-10 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search campaigns..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button
            type="submit"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 