// components/home/BookGrid.js
import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import ProductCard from '../shop/ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

const BookGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Best Sellers');
  const [categories, setCategories] = useState([]);

  const filterCategories = [
    'All',
    'Best Sellers', 
    'Fantasy',
    'History',
    'Art',
    'Love Stories'
  ];

  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsData = await api.getProducts({ 
        per_page: 6,
        featured: activeCategory === 'Best Sellers' ? true : undefined,
        category: activeCategory !== 'All' && activeCategory !== 'Best Sellers' 
          ? categories.find(cat => cat.name === activeCategory)?.id 
          : undefined
      });
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data for development
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await api.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Re-fetch when category changes
  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [activeCategory, categories]);

  // Mock data for development/fallback
  const mockProducts = [
    {
      id: 1,
      name: "Winter Darkest Tragedy",
      price: "38.00",
      images: [{ src: "/images/book-1.jpg" }],
      on_sale: false,
      stock_status: "outofstock",
      categories: [{ name: "Best Sellers" }],
      short_description: "JOHN STRASS"
    },
    {
      id: 2,
      name: "Symphony Of Trilogy",
      price: "22.00",
      images: [{ src: "/images/book-2.jpg" }],
      on_sale: false,
      stock_status: "instock",
      categories: [{ name: "Fantasy" }],
      short_description: "JESSICA JOHNSON"
    },
    {
      id: 3,
      name: "Wellness And Paradise",
      price: "67.00",
      images: [{ src: "/images/book-3.jpg" }],
      on_sale: false,
      stock_status: "instock",
      categories: [{ name: "Art" }],
      short_description: "JANE DOE"
    },
    {
      id: 4,
      name: "Renaissance History",
      price: "39.00",
      regular_price: "47.00",
      images: [{ src: "/images/book-4.jpg" }],
      on_sale: true,
      stock_status: "instock",
      categories: [{ name: "History" }],
      short_description: "JAMES HOFFMAN"
    },
    {
      id: 5,
      name: "Fantasy Storytelling",
      price: "29.00",
      images: [{ src: "/images/book-5.jpg" }],
      on_sale: false,
      stock_status: "instock",
      categories: [{ name: "Fantasy" }],
      short_description: "ADAM STRASS"
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
          <LoadingSpinner size="large" text="Loading books..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookGrid;
