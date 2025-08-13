// components/home/ServicesSection.js
import React from 'react';
import Link from 'next/link';

const ServicesSection = () => {
  return (
    <section className="relative section-padding bg-cover bg-center" 
             style={{
               backgroundImage: 'url(https://i.pinimg.com/1200x/d9/37/61/d93761b42370edc9680e51e567e287eb.jpg)',
               backgroundColor: '#111827' // Fallback color
             }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-75"></div>
      
      {/* Content */}
      <div className="relative z-10 container text-center text-white">
        {/* Section Label */}
        <div className="flex justify-center mb-6">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-gray-800 text-sm">✒️</span>
          </div>
        </div>
        
        {/* Subtitle */}
        <p className="text-sm uppercase tracking-wider text-gray-300 mb-4">
          YOUR STORY, PUBLISHED
        </p>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-serif text-white mb-6">
            Self-Publishing Services
          </h2>
          <p className="text-xl lg:text-2xl leading-relaxed text-gray-200">
            Have a story waiting to be told? Our self-publishing platform provides aspiring authors with the tools and support needed to bring their manuscript to life and share it with the world.
          </p>
          
          {/* CTA Button */}
          <div className="mt-8">
            <Link href="/self-publication">
              <button className="btn-outline border-white text-white hover:bg-white hover:text-gray-900">
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
