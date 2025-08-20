// components/shop/ProductGrid.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';
import LoadingSpinner from '../common/LoadingSpinner';

const ProductGrid = ({ products = [], categories = [], totalPages = 1, currentPage = 1, totalProducts }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // This effect shows the loader when the route is changing
  useEffect(() => {
    const handleStart = (url) => (url !== router.asPath) && setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // This function builds the new URL when a filter changes
  const handleFilterChange = (newFilters) => {
    let query = { ...router.query, page: 1 }; // Reset to page 1 on any filter change

    // Handle category selection
    if (newFilters.category) {
      const selectedCategory = categories.find(c => c.id === parseInt(newFilters.category, 10));
      if (selectedCategory) {
        query.category_slug = selectedCategory.slug;
      }
    } else {
      delete query.category_slug;
    }
    
    // Update other filters
    query.sortBy = newFilters.sortBy;
    query.priceRange = newFilters.priceRange;
    query.inStock = newFilters.inStock;
    query.onSale = newFilters.onSale;

    // Clean up empty/default values for a cleaner URL
    Object.keys(query).forEach(key => {
      if (query[key] === '' || query[key] === false || (key === 'sortBy' && query[key] === 'newest')) {
        delete query[key];
      }
    });
    
    router.push({ pathname: '/shop', query });
  };

  // This function builds the new URL when the page changes
  const handlePageChange = (page) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page },
    });
  };

  const generatePagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ProductFilter
        categories={categories}
        onFilterChange={handleFilterChange}
        currentFilters={router.query}
        totalProducts={totalProducts}
      />
      <div className="container section-padding">
        {loading ? (
          <LoadingSpinner size="large" text="Loading products..." />
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading} className="px-3 py-2 text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                  {generatePagination().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                      className={`px-3 py-2 rounded ${page === currentPage ? 'bg-red-600 text-white' : 'text-gray-700 hover:text-red-600'}`}
                    >{page}</button>
                  ))}
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || loading} className="px-3 py-2 text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;