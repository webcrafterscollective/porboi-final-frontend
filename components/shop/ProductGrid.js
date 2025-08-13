// components/shop/ProductGrid.js
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductFilter from './ProductFilter';
import LoadingSpinner from '../common/LoadingSpinner';
import { api } from '../../lib/api';

const ProductGrid = ({ initialProducts = [], initialCategories = [] }) => {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    sortBy: 'newest',
    inStock: false,
    onSale: false
  });

  const productsPerPage = 12;

  // Fetch products when filters or page changes
  useEffect(() => {
    fetchProducts();
  }, [filters, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Build API parameters
      const params = {
        page: currentPage,
        per_page: productsPerPage,
      };

      // Add category filter
      if (filters.category) {
        params.category = filters.category;
      }

      // Add stock filter
      if (filters.inStock) {
        params.stock_status = 'instock';
      }

      // Add sale filter
      if (filters.onSale) {
        params.on_sale = true;
      }

      // Add sorting
      switch (filters.sortBy) {
        case 'price-asc':
          params.orderby = 'price';
          params.order = 'asc';
          break;
        case 'price-desc':
          params.orderby = 'price';
          params.order = 'desc';
          break;
        case 'name-asc':
          params.orderby = 'title';
          params.order = 'asc';
          break;
        case 'popularity':
          params.orderby = 'popularity';
          params.order = 'desc';
          break;
        default:
          params.orderby = 'date';
          params.order = 'desc';
      }

      // Add price range filter (implemented on frontend for simplicity)
      const response = await api.getProducts(params);
      
      let filteredProducts = response;

      // Apply price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        filteredProducts = response.filter(product => {
          const price = parseFloat(product.price);
          if (max === 999) return price >= min; // "Over $100"
          return price >= min && price <= max;
        });
      }

      setProducts(filteredProducts);
      setTotalProducts(filteredProducts.length);
      setTotalPages(Math.ceil(filteredProducts.length / productsPerPage));

    } catch (error) {
      console.error('Error fetching products:', error);
      // Use mock data on error
      setProducts(getMockProducts());
      setTotalProducts(getMockProducts().length);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mock products for development
  const getMockProducts = () => [
    {
      id: 1,
      name: "Winter Darkest Tragedy",
      price: "38.00",
      images: [{ src: "/images/book-1.jpg" }],
      stock_status: "outofstock",
      on_sale: false,
      categories: [{ name: "Drama" }],
      short_description: "JOHN STRASS"
    },
    {
      id: 2,
      name: "Symphony Of Trilogy",
      price: "22.00",
      images: [{ src: "/images/book-2.jpg" }],
      stock_status: "instock",
      on_sale: false,
      categories: [{ name: "Fantasy" }],
      short_description: "JESSICA JOHNSON"
    },
    // Add more mock products as needed
  ];

  // Generate pagination
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
      {/* Filter Bar */}
      <ProductFilter
        categories={categories}
        onFilterChange={handleFilterChange}
        currentFilters={filters}
        totalProducts={totalProducts}
      />

      {/* Products Grid */}
      <div className="container section-padding">
        {loading ? (
          <LoadingSpinner size="large" text="Loading products..." />
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> {/* UPDATED */}
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {generatePagination().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded ${
                        page === currentPage
                          ? 'bg-red-600 text-white'
                          : 'text-gray-700 hover:text-red-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters to see more results.
            </p>
            <button
              onClick={() => handleFilterChange({
                category: '',
                priceRange: '',
                sortBy: 'newest',
                inStock: false,
                onSale: false
              })}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;