// pages/shop/index.js
import React from 'react';
import Head from 'next/head';
import ProductGrid from '../../components/shop/ProductGrid';
import { api } from '../../lib/api';

const ShopPage = ({ products, categories }) => {
  return (
    <>
      <Head>
        <title>Shop - ChapterOne Bookstore</title>
        <meta name="description" content="Browse our collection of books including bestsellers, fantasy, history, art, and love stories. Find your next great read at ChapterOne." />
        <meta name="keywords" content="buy books online, bookstore, literature, bestsellers, fantasy books, history books" />
      </Head>

      {/* Page Header */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl lg:text-5xl font-serif mb-4">Our Bookstore</h1>
          <p className="text-xl text-gray-300">
            Discover your next favorite book from our curated collection
          </p>
        </div>
      </div>

      {/* Products Grid with Filters */}
      <ProductGrid 
        initialProducts={products} 
        initialCategories={categories} 
      />
    </>
  );
};

export async function getStaticProps() {
  try {
    // Fetch initial products and categories
    const [products, categories] = await Promise.all([
      api.getProducts({ per_page: 20 }),
      api.getCategories()
    ]);

    return {
      props: {
        products: products || [],
        categories: categories || [],
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching shop data:', error);
    return {
      props: {
        products: [],
        categories: [],
      },
      revalidate: 300,
    };
  }
}

export default ShopPage;