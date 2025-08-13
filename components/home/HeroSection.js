// components/home/HeroSection.js
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const HeroSection = ({ featuredBooks = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Updated hero data with Kolkata-centric copy and your images
  const heroSlides = [
    {
      id: 1,
      title: "কলেজ স্ট্রিটের প্রতিধ্বনি",
      subtitle: "শব্দের চিরন্তন ঐতিহ্য",
      description: "কলেজ স্ট্রিটের বইপাড়ায় লুকিয়ে আছে কলকাতার সাহিত্যিক আত্মা—দুর্লভ সংস্করণ, অমর ক্লাসিক, আর গল্পে ভরা প্রতিটি গলি। বইপ্রেমীদের জন্য এক অফুরন্ত ধনভান্ডার।",
      badge: "নতুন সংগ্রহ",
      image: "https://i.pinimg.com/1200x/e4/83/e3/e483e37c729ad6a0bfe40e4cca6b5609.jpg",
      backgroundImage: "https://i.pinimg.com/1200x/e4/83/e3/e483e37c729ad6a0bfe40e4cca6b5609.jpg",
      link: "/shop?category=bengali-classics"
    },
    {
      id: 2,
      title: "আনন্দ নগরীর গল্প",
      subtitle: "সমসাময়িক বাংলা কথন",
      description: "আজকের বাঙালির জীবন, স্বপ্ন আর টানাপোড়েন—সমসাময়িক লেখকদের তাজা ভাষায়। এমন সব আখ্যান যা আপনাকে নিয়ে যাবে আধুনিক কলকাতার হৃদয়ে।",
      badge: "সমকালীন লেখক",
      image: "https://i.pinimg.com/736x/bf/9d/99/bf9d991c8efc92fb6772ca07a98b9158.jpg",
      backgroundImage: "https://i.pinimg.com/736x/bf/9d/99/bf9d991c8efc92fb6772ca07a98b9158.jpg",
      link: "/shop?category=modern-bengali-literature"
    },
    {
      id: 3,
      title: "কলকাতা বইমেলার আমেজ",
      subtitle: "পাঠের উৎসব সারা বছর",
      description: "শুধু জানুয়ারি নয়—প্রতিদিনই হোক বইমেলার আনন্দ। নতুন প্রকাশনা, প্রিয় লেখকের স্বাক্ষরিত কপি আর এমন বই যা হৃদয়ে জায়গা করে নেবে।",
      badge: "মেলা স্পেশাল",
      image: "https://i.pinimg.com/1200x/5c/c8/dd/5cc8ddb1aa45d8496aa20736db3c29a4.jpg",
      backgroundImage: "https://i.pinimg.com/1200x/5c/c8/dd/5cc8ddb1aa45d8496aa20736db3c29a4.jpg",
      link: "/shop?category=book-fair-collection"
    }
  ];


  const slides = featuredBooks.length > 0 ? featuredBooks : heroSlides;

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

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
          backgroundImage: `url(${slides[currentSlide].backgroundImage})` 
        }}
      >
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center py-20 lg:py-0">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="lg:col-span-3 text-white space-y-4 md:space-y-6 animate-fade-in text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center">
                <div className="bg-literary-maroon text-white px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold font-sans">
                    {slides[currentSlide].badge}
                  </span>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-sm uppercase tracking-wider text-gray-300">
                {slides[currentSlide].subtitle}
              </p>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight text-shadow-lg">
                {slides[currentSlide].title}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-300 max-w-lg leading-relaxed font-sans mx-auto lg:mx-0">
                {slides[currentSlide].description}
              </p>

              {/* CTA Button */}
              <div className="pt-4">
                <Link href={slides[currentSlide].link}>
                    <button className="btn-outline text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 font-sans">
                        সংগ্রহ দেখুন
                    </button>
                </Link>
              </div>
            </div>

            {/* Book Image */}
            <div className="lg:col-span-2 flex justify-center mt-8 lg:mt-0">
              <div className="relative">
                <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full border-4 border-white border-opacity-20 flex items-center justify-center">
                  <img 
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].title}
                    className="w-52 h-52 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full object-cover shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 lg:left-8 top-1/2 transform -translate-y-1/2 z-20 text-white hover:text-gray-300 transition-colors p-2"
      >
        <ChevronLeft className="w-8 h-8 lg:w-12 lg:h-12" />
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-20 text-white hover:text-gray-300 transition-colors p-2"
      >
        <ChevronRight className="w-8 h-8 lg:w-12 lg:h-12" />
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
