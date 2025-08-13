// pages/500.js - Custom 500 Error Page
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

const Custom500 = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <Head>
        <title>Server Error - ChapterOne Bookstore</title>
        <meta name="description" content="We're experiencing technical difficulties. Please try again later." />
      </Head>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {/* 500 Illustration */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-red-600 mb-4">500</div>
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto" />
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-serif text-gray-900 mb-4">
            Something Went Wrong
          </h1>
          <p className="text-gray-600 mb-8">
            We're experiencing some technical difficulties on our end. 
            Our team has been notified and is working to fix the issue.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              onClick={handleRefresh}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            
            <Link href="/">
              <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Back to Homepage</span>
              </button>
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If the problem persists, please contact our support team at{' '}
              <a href="mailto:support@chapterone.com" className="text-red-600 hover:text-red-700">
                support@chapterone.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom500;