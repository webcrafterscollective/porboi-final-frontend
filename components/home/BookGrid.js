// components/home/BookGrid.js
import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import ProductCard from '../shop/ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

const BookGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  // Fixed list of categories for filtering
  const filterCategories = [
    'All',
    'Books',
    'Text Books',
    'Old Books',
    'Accessories'
  ];

  // Fetch products whenever the active category changes
  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Set up parameters for the API call
      const params = {
        per_page: 10, // Fetch 10 products per category
      };

      // If a specific category is selected (and not 'All'), add it to the params.
      // Note: This assumes the WooCommerce API is set up to find categories by their name/slug.
      if (activeCategory !== 'All') {
        params.category = activeCategory;
      }

      const productsData = await api.getProducts(params);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data for development if the API fails
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development/fallback
  const mockProducts = [
    {
      id: 1,
      name: "Winter Darkest Tragedy",
      price: "38.00",
      images: [{ src: "/images/book-1.jpg" }],
      on_sale: false,
      stock_status: "outofstock",
      categories: [{ name: "Books" }],
      short_description: "JOHN STRASS"
    },
    {
      id: 2,
      name: "Symphony Of Trilogy",
      price: "22.00",
      images: [{ src: "/images/book-2.jpg" }],
      on_sale: false,
      stock_status: "instock",
      categories: [{ name: "Books" }],
      short_description: "JESSICA JOHNSON"
    },
    {
      id: 3,
      name: "University Physics Textbook",
      price: "67.00",
      images: [{ src: "/images/book-3.jpg" }],
      on_sale: false,
      stock_status: "instock",
      categories: [{ name: "Text Books" }],
      short_description: "JANE DOE"
    },
    {
      id: 4,
      name: "A Rare First Edition",
      price: "95.00",
      regular_price: "120.00",
      images: [{ src: "/images/book-4.jpg" }],
      on_sale: true,
      stock_status: "instock",
      categories: [{ name: "Old Books" }],
      short_description: "JAMES HOFFMAN"
    },
    {
      id: 5,
      name: "Leather Bookmark",
      price: "15.00",
      images: [{ src: "/images/book-5.jpg" }],
      on_sale: false,
      stock_status: "instock",
      categories: [{ name: "Accessories" }],
      short_description: "ARTISAN GOODS"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container">
        {/* Category Filter */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {filterCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`category-filter ${activeCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <LoadingSpinner size="large" text={`Loading ${activeCategory}...`} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center">
                <p>No products found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookGrid;