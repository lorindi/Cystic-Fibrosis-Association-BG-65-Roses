'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';

// Category interface
interface Category {
  id: string;
  title: string;
  hashtags: string[];
  count?: number;
}

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  categories?: Category[]; // Optional prop for categories
}

export default function CategoryFilter({ 
  selectedCategories, 
  onCategoryChange,
  categories = [] // Default value
}: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  const handleCategoryClick = (categoryId: string) => {
    let newCategories: string[];
    
    // If category is already selected, remove it, otherwise add it
    if (selectedCategories.includes(categoryId)) {
      newCategories = selectedCategories.filter(id => id !== categoryId);
    } else {
      newCategories = [...selectedCategories, categoryId];
    }
    
    onCategoryChange(newCategories);
    
    // Update URL parameters
    const params = new URLSearchParams(searchParams.toString());
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    } else {
      params.delete('categories');
    }
    
    // Preserve search query parameter if it exists
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    
    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl);
  };

  const clearAllFilters = () => {
    onCategoryChange([]);
    
    // Remove categories parameter from URL, keep other parameters
    const params = new URLSearchParams(searchParams.toString());
    params.delete('categories');
    
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl);
  };

  // If categories are still loading, show indicator
  if (loading) {
    return (
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="font-medium text-sm">Filter by category:</span>
          <div className="loading loading-spinner loading-sm text-primary"></div>
        </div>
      </div>
    );
  }

  // Move Cystic Fibrosis to the front
  const cfCategory = categories.find(cat => cat.id === 'cysticfibrosis');
  const otherCategories = categories.filter(cat => cat.id !== 'cysticfibrosis');
  
  return (
    <div className="mb-4 overflow-x-auto">
      <div className="flex flex-wrap gap-1.5 items-center">
        <button
          onClick={() => clearAllFilters()}
          className={`px-2 py-1 text-sm rounded-full border transition-colors ${
            selectedCategories.length === 0
              ? 'bg-primary text-white border-primary' 
              : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
          }`}
        >
          All Categories
        </button>
        
        {/* Special button for Cystic Fibrosis, always after All Categories */}
        {cfCategory && (
          <button
            onClick={() => handleCategoryClick('cysticfibrosis')}
            className={`px-2 py-1 text-sm rounded-full border transition-colors ${
              selectedCategories.includes('cysticfibrosis')
                ? 'bg-primary text-white border-primary' 
                : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
            }`}
          >
            Cystic Fibrosis
          </button>
        )}
        
        {/* Display all other categories in a single row with wrap */}
        {otherCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-2 py-1 text-sm rounded-full border transition-colors ${
              selectedCategories.includes(category.id)
                ? 'bg-primary text-white border-primary' 
                : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>
      
      {/* Show active filters summary if more than one selected */}
      {selectedCategories.length > 1 && (
        <div className="mt-2 text-xs text-gray-600">
          <span>Active filters: {selectedCategories.length}</span>
        </div>
      )}
    </div>
  );
} 