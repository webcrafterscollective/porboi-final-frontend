// components/home/ServicesSection.js
import React from 'react';

const ServicesSection = () => {
  return (
    <section className="relative py-24 bg-cover bg-center" 
             style={{
               backgroundImage: 'url(/images/services-bg.jpg)',
               backgroundColor: '#10b981' // Fallback color matching your green section
             }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-green-600 bg-opacity-90"></div>
      
      {/* Content */}
      <div className="relative z-10 container text-center text-white">
        {/* Section Label */}
        <div className="flex justify-center mb-6">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-green-600 text-sm">❤️</span>
          </div>
        </div>
        
        {/* Subtitle */}
        <p className="text-sm uppercase tracking-wider text-green-100 mb-4">
          OUR SERVICES
        </p>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <p className="text-xl lg:text-2xl leading-relaxed text-green-50">
            Aorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.
          </p>
          
          {/* CTA Button */}
          <div className="mt-8">
            <button className="btn-outline border-white text-white hover:bg-white hover:text-green-600">
              READ MORE
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;