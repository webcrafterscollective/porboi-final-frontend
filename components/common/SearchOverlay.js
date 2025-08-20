// components/common/SearchOverlay.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Search, Book } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { api } from '../../lib/api';
import LoadingSpinner from './LoadingSpinner';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm.length > 2) {
        setLoading(true);
        try {
          const products = await api.getProducts({ search: debouncedSearchTerm });
          setResults(products);
        } catch (error) {
          console.error("Search failed:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    // Reset search when the overlay is closed
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-[100] animate-fade-in">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
        {/* Header with Search Input and Close Button */}
        <div className="flex-shrink-0 flex items-center justify-between py-4 border-b border-gray-200">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for books, authors, or categories..."
              className="w-full bg-transparent border-none text-2xl font-serif text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0"
              autoFocus
            />
            <Search className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>
          <button onClick={onClose} className="ml-4 p-2 text-gray-500 hover:text-gray-800">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Search Results */}
        <div className="flex-grow overflow-y-auto py-8">
          {loading && <LoadingSpinner text="Searching..." />}
          {!loading && results.length > 0 && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {results.map(product => (
                <Link key={product.id} href={`/shop/${product.slug}`} onClick={onClose} className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="w-16 h-20 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center mr-4">
                    {product.images?.[0]?.src ? (
                      <img src={product.images[0].src} alt={product.name} className="w-full h-full object-cover rounded-md" />
                    ) : (
                      <Book className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900" dangerouslySetInnerHTML={{ __html: product.name }} />
                    <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: product.short_description || '' }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!loading && debouncedSearchTerm.length > 2 && results.length === 0 && (
            <div className="text-center text-gray-500">
              <p>No results found for "{debouncedSearchTerm}".</p>
            </div>
          )}
          {!loading && debouncedSearchTerm.length <= 2 && (
             <div className="text-center text-gray-500">
              <p>Please type at least 3 characters to start searching.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;