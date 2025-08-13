// pages/index.js
import React from 'react';
import Head from 'next/head';
import HeroSection from '../components/home/HeroSection';
import BookGrid from '../components/home/BookGrid';
import ServicesSection from '../components/home/ServicesSection';
import AuthorsSection from '../components/home/AuthorsSection';
import BookReviewsSection from '../components/home/BookReviewsSection'; // Import the new section
import GallerySection from '../components/home/GallerySection';
import { api } from '../lib/api';

export default function Home({ featuredProducts, categories }) {
  return (
    <>
      <Head>
        <title>ChapterOne - The All-Time Classics Bookstore</title>
        <meta name="description" content="Discover the all-time classics and bestselling books at ChapterOne. Your premier destination for quality literature, fantasy, history, art, and love stories." />
        <meta name="keywords" content="bookstore, books, classics, bestsellers, fantasy, history, art, love stories, literature" />
        <meta property="og:title" content="ChapterOne - The All-Time Classics Bookstore" />
        <meta property="og:description" content="Discover the all-time classics and bestselling books at ChapterOne." />
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

        {/* Authors of the Month */}
        <AuthorsSection />

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
      per_page: 3 
    });

    // Fetch categories for navigation
    const categories = await api.getCategories();

    return {
      props: {
        featuredProducts: featuredProducts || [],
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
        featuredProducts: [],
        categories: [],
      },
      revalidate: 300, // Retry more frequently on error
    };
  }
}
