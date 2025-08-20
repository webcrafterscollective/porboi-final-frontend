// components/shop/ProductFilter.js
import React, { useState, useEffect } from 'react';
import { ChevronDown, X, Filter } from 'lucide-react';

const ProductFilter = ({
  categories = [],
  onFilterChange,
  currentFilters = {},
  totalProducts = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Find the current category ID from the slug in the URL to correctly set the dropdown
  const findCategoryIdBySlug = (slug) => {
    const category = categories.find(c => c.slug === slug);
    return category ? category.id.toString() : '';
  };
  
  const [filters, setFilters] = useState({
    category: findCategoryIdBySlug(currentFilters.category_slug) || '',
    priceRange: currentFilters.priceRange || '',
    sortBy: currentFilters.sortBy || 'newest',
    inStock: currentFilters.inStock === 'true',
    onSale: currentFilters.onSale === 'true'
  });

  // Keep the filter UI in sync with URL changes (e.g., browser back/forward)
  useEffect(() => {
    setFilters({
      category: findCategoryIdBySlug(currentFilters.category_slug) || '',
      priceRange: currentFilters.priceRange || '',
      sortBy: currentFilters.sortBy || 'newest',
      inStock: currentFilters.inStock === 'true',
      onSale: currentFilters.onSale === 'true'
    });
  }, [currentFilters, categories]);

  const priceRanges = [
    { label: 'All Prices', value: '' },
    { label: 'Under ₹500', value: '0-499.99' },
    { label: '₹500 - ₹999.99', value: '500-999.99' },
    { label: '₹1000 - ₹1999.99', value: '1000-1999.99' },
    { label: 'Over ₹2000', value: '2000-999999' }
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Name: A to Z', value: 'name-asc' },
    { label: 'Best Selling', value: 'popularity' }
  ];
  
  const handleLocalFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'sortBy' && value === 'newest') return false;
    return value !== '' && value !== false;
  });

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="container py-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="text-gray-600">
            {totalProducts} results
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <div className="relative">
              <select
                value={filters.category}
                onChange={(e) => handleLocalFilterChange('category', e.target.value)}
                className="form-select text-sm appearance-none pr-8"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id} dangerouslySetInnerHTML={{ __html: category.name }} />
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={filters.priceRange}
                onChange={(e) => handleLocalFilterChange('priceRange', e.target.value)}
                className="form-select text-sm appearance-none pr-8"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => handleLocalFilterChange('sortBy', e.target.value)}
                className="form-select text-sm appearance-none pr-8"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleLocalFilterChange('inStock', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span>In Stock</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.onSale}
                  onChange={(e) => handleLocalFilterChange('onSale', e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span>On Sale</span>
              </label>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex items-center space-x-2 text-gray-600 hover:text-red-600"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;