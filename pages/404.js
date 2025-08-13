// pages/404.js - Custom 404 Error Page
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { BookOpen, Home, Search } from 'lucide-react';

const Custom404 = () => {
  return (
    <>
      <Head>
        <title>Page Not Found - ChapterOne Bookstore</title>
        <meta name="description" content="The page you're looking for doesn't exist. Browse our collection or return to the homepage." />
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-red-600 mb-4">404</div>
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto" />
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-serif text-gray-900 mb-4">
            Chapter Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Sorry, the page you're looking for seems to have been misplaced in our library. 
            Let's help you find what you're looking for.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/">
              <button className="w-full btn-primary flex items-center justify-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Back to Homepage</span>
              </button>
            </Link>
            
            <Link href="/shop">
              <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Browse Books</span>
              </button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/shop?category=bestsellers" className="text-red-600 hover:text-red-700">
                Bestsellers
              </Link>
              <Link href="/shop?category=fantasy" className="text-red-600 hover:text-red-700">
                Fantasy
              </Link>
              <Link href="/events" className="text-red-600 hover:text-red-700">
                Events
              </Link>
              <Link href="/blog" className="text-red-600 hover:text-red-700">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom404;