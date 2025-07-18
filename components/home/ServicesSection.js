// components/home/ServicesSection.js
import React from 'react';
import Link from 'next/link';

const ServicesSection = () => {
  return (
    <section className="relative section-padding bg-cover bg-center" 
             style={{
               backgroundImage: 'url(https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
               backgroundColor: '#10b981' // Fallback color
             }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-green-600 bg-opacity-90"></div>
      
      {/* Content */}
      <div className="relative z-10 container text-center text-white">
        {/* Section Label */}
        <div className="flex justify-center mb-6">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-green-600 text-sm">✒️</span>
          </div>
        </div>
        
        {/* Subtitle */}
        <p className="text-sm uppercase tracking-wider text-green-100 mb-4">
          YOUR STORY, PUBLISHED
        </p>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-serif text-white mb-6">
            Self-Publishing Services
          </h2>
          <p className="text-xl lg:text-2xl leading-relaxed text-green-50">
            Have a story waiting to be told? Our self-publishing platform provides aspiring authors with the tools and support needed to bring their manuscript to life and share it with the world.
          </p>
          
          {/* CTA Button */}
          <div className="mt-8">
            <Link href="/self-publication">
              <button className="btn-outline border-white text-white hover:bg-white hover:text-green-600">
                START YOUR JOURNEY
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
