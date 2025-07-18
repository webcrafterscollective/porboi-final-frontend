// components/home/HeroSection.js
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSection = ({ featuredBooks = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Default hero data if no featured books provided
  const defaultHeroData = [
    {
      id: 1,
      title: "The all-time classics",
      subtitle: "IT'S CHAPTERONE",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna",
      badge: "#1 New York Times Bestseller",
      image: "/images/hero-book-1.jpg", // You'll need to add these images
      backgroundImage: "/images/hero-bg-1.jpg",
    },
    {
      id: 2,
      title: "Fantasy Adventures",
      subtitle: "IT'S CHAPTERONE",
      description: "Explore magical worlds and epic adventures with our collection of fantasy novels",
      badge: "Editor's Choice",
      image: "/images/hero-book-2.jpg",
      backgroundImage: "/images/hero-bg-2.jpg",
    },
    {
      id: 3,
      title: "Historical Fiction",
      subtitle: "IT'S CHAPTERONE",
      description: "Journey through time with our carefully curated historical fiction collection",
      badge: "Critics' Pick",
      image: "/images/hero-book-3.jpg",
      backgroundImage: "/images/hero-bg-3.jpg",
    }
  ];

  const slides = featuredBooks.length > 0 ? featuredBooks : defaultHeroData;

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-screen bg-gray-900 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: slides[currentSlide]?.backgroundImage 
            ? `url(${slides[currentSlide].backgroundImage})` 
            : 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
        }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-white space-y-6 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center">
                <div className="bg-red-600 text-white px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold">
                    {slides[currentSlide]?.badge || "#1 New York Times Bestseller"}
                  </span>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-sm uppercase tracking-wider text-gray-300">
                {slides[currentSlide]?.subtitle || "IT'S CHAPTERONE"}
              </p>

              {/* Title */}
              <h1 className="text-4xl lg:text-6xl font-serif font-bold leading-tight text-shadow-lg">
                {slides[currentSlide]?.title || "The all-time classics"}
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                {slides[currentSlide]?.description || "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna"}
              </p>

              {/* CTA Button */}
              <div className="pt-4">
                <button className="btn-outline text-lg px-8 py-4">
                  READ MORE
                </button>
              </div>
            </div>

            {/* Book Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Circular Background */}
                <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full border-4 border-white border-opacity-20 flex items-center justify-center">
                  {slides[currentSlide]?.image ? (
                    <img 
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      className="w-64 h-64 lg:w-80 lg:h-80 rounded-full object-cover"
                    />
                  ) : (
                    // Placeholder circular design matching your screenshot
                    <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gray-800 flex items-center justify-center text-white">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📖</div>
                        <div className="text-2xl font-bold">IMAGINE</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 text-white hover:text-red-400 transition-colors p-2"
      >
        <ChevronLeft className="w-12 h-12" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 text-white hover:text-red-400 transition-colors p-2"
      >
        <ChevronRight className="w-12 h-12" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;