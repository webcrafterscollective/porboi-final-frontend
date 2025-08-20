// pages/index.js
import React from 'react';
import Head from 'next/head';
import HeroSection from '../components/home/HeroSection';
import BookGrid from '../components/home/BookGrid';
import ServicesSection from '../components/home/ServicesSection';
import AuthorsSection from '../components/home/AuthorsSection';
import BookReviewsSection from '../components/home/BookReviewsSection'; // Import the new section
import GallerySection from '../components/home/GallerySection';
import HorizontalProductScroller from '../components/home/HorizontalProductScroller';
import ProductGridSection from '../components/home/ProductGridSection';
import { api } from '../lib/api';

export default function Home({newBooks, featuredProducts, handmadeProducts, categories }) {
  return (
    <>
      <Head>
        <title>Porboi.in - The All-Time Classics Bookstore</title>
        <meta name="description" content="Discover the all-time classics and bestselling books at porboi.in. Your premier destination for quality literature, fantasy, history, art, and love stories." />
        <meta name="keywords" content="bookstore, books, classics, bestsellers, fantasy, history, art, love stories, literature" />
        <meta property="og:title" content="Porboi.in - The All-Time Classics Bookstore" />
        <meta property="og:description" content="Discover the all-time classics and bestselling books at Porboi.in." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-domain.com" />
        <meta property="og:image" content="https://your-domain.com/images/og-image.jpg" />
        <link rel="canonical" href="https://your-domain.com" />
      </Head>

      <div className="homepage">
        {/* Hero Section with Carousel */}
        <HeroSection featuredBooks={featuredProducts} />

        {/* Featured Books Grid with Category Filter */}
        <BookGrid />

        {/* Services Section */}
        <ServicesSection />

         {/* New Books Section with Horizontal Scroll */}
        <HorizontalProductScroller title="New Books" products={newBooks} />
        
        {/* Featured Products Grid */}
        <ProductGridSection title="Featured Products" products={featuredProducts} />

        {/* Handmade Products Grid */}
        <ProductGridSection title="Handmade Corner" products={handmadeProducts} link="/shop?category_slug=fashion" />

   

        {/* Gallery Grid */}
        <GallerySection />

        {/* Book Reviews Section */}
        <BookReviewsSection />
      </div>
    </>
  );
}

// Server-side data fetching
export async function getStaticProps() {
  try {
    // Fetch featured products for hero carousel
    const featuredProducts = await api.getProducts({ 
      featured: true, 
      per_page: 8
    });

    // Fetch categories for navigation
    const categories = await api.getCategories();

     // Fetch the latest 10 products for the "New Books" section
   const bookCategory = await api.getCategoryBySlug('book');
    let newBooks = [];
    if (bookCategory) {
      // Fetch the latest 10 products specifically from the 'Book' category
      newBooks = await api.getProducts({
        category: bookCategory.id,
        orderby: 'date',
        order: 'desc',
        per_page: 10,
      });
    }


    // Fetch the category ID for "Fashion"
    const fashionCategory = await api.getCategoryBySlug('fashion');
    let handmadeProducts = [];
    if (fashionCategory) {
      handmadeProducts = await api.getProducts({
        category: fashionCategory.id,
        per_page: 4,
      });
    }


    return {
      props: {
        newBooks: newBooks || [],
        featuredProducts: featuredProducts || [],
        handmadeProducts: handmadeProducts || [],
        categories: categories || [],
      },
      // Revalidate every 60 minutes
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    
    // Return empty data on error - components will handle fallbacks
    return {
      props: {
        newBooks: [],
        featuredProducts: [],
        handmadeProducts: [],
        categories: [],
      },
      revalidate: 300, // Retry more frequently on error
    };
  }
}
