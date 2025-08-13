// pages/shop/index.js
import React from 'react';
import Head from 'next/head';
import ProductGrid from '../../components/shop/ProductGrid';
import { api } from '../../lib/api';
import { Book } from 'lucide-react';

const ShopPage = ({ products, categories }) => {
  return (
    <>
      <Head>
        <title>বইসমূহ - porboi.in</title>
        <meta name="description" content="আমাদের বাছাই করা বাংলা ও বিশ্বসাহিত্যের সংগ্রহ ঘুরে দেখুন। আপনার পরবর্তী প্রিয় বইটি খুঁজে নিন porboi.in এ।" />
        <meta name="keywords" content="বাংলা বই কিনুন, কলকাতা বইয়ের দোকান, অনলাইন বইয়ের দোকান, বাংলা সাহিত্য" />
      </Head>

      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-24">
        <div className="container text-center">
          <div className="inline-block bg-red-100 text-red-600 p-4 rounded-full mb-4">
            <Book className="w-8 h-8" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 mb-4">পড়বই-এর গ্রন্থভান্ডার</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            সময়ের পরীক্ষায় উত্তীর্ণ শ্রেষ্ঠ সাহিত্য ও সমকালীন রত্নসমূহ আবিষ্কার করুন আমাদের বাছাই করা সংগ্রহে।
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
