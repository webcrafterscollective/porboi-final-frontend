// components/home/HeroSection.js
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const HeroSection = ({ featuredBooks = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Local fallback slides
  const heroSlides = [
    { id: 1, image: "/banners/banner1.png", link: "/shop?category=bengali-classics" },
    { id: 2, image: "/banners/banner2.png", link: "/shop?category=modern-bengali-literature" },
    { id: 3, image: "/banners/banner3.png", link: "/shop?category=book-fair-collection" }
  ];

  // If featuredBooks exist, use them; else fallback to heroSlides
  const slides = featuredBooks.length > 0 
    ? featuredBooks.map(book => ({
        id: book.id,
        image: book.images[0]?.src || 'https://placehold.co/1920x1080?text=Porboi',
        link: `/shop/${book.slug || book.id}`
      }))
    : heroSlides;

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  return (
    <section className="relative aspect-video w-full bg-gray-900 overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <Link href={slide.link} key={slide.id}>
          <div
            className="absolute inset-0 w-full h-full transition-opacity duration-1000"
            style={{ opacity: index === currentSlide ? 1 : 0 }}
          >
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-contain" // Full image visible
            />
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
          </div>
        </Link>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 text-white bg-black bg-opacity-30 rounded-full p-2 hover:bg-opacity-50 transition-colors"
      >
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
