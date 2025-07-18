// components/home/HeroSection.js
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const HeroSection = ({ featuredBooks = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Updated hero data with professional copy and Pexels images
  const heroSlides = [
    {
      id: 1,
      title: "Explore Worlds of Fiction",
      subtitle: "IMAGINATION UNBOUND",
      description: "Dive into captivating narratives and unforgettable characters. Our fiction collection spans from timeless classics to modern masterpieces.",
      badge: "Critically Acclaimed Fiction",
      image: "https://images.pexels.com/photos/1926988/pexels-photo-1926988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      backgroundImage: "https://images.pexels.com/photos/261794/pexels-photo-261794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/shop?category=fiction"
    },
    {
      id: 2,
      title: "The Art of the Essay",
      subtitle: "PERSPECTIVES & PROSE",
      description: "Engage with profound ideas and brilliant arguments from the world's most insightful thinkers. Discover essays that challenge and inspire.",
      badge: "Thought-Provoking Essays",
      image: "https://images.pexels.com/photos/3747505/pexels-photo-3747505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      backgroundImage: "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/shop?category=essays"
    },
    {
      id: 3,
      title: "The Power of Poetry",
      subtitle: "WORDS THAT MOVE",
      description: "Experience the beauty and emotion of verse. Our poetry collection features iconic voices and contemporary poets who capture the human spirit.",
      badge: "Evocative Poetry",
      image: "https://images.pexels.com/photos/3771073/pexels-photo-3771073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      backgroundImage: "https://images.pexels.com/photos/236111/pexels-photo-236111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/shop?category=poetry"
    },
    {
      id: 4,
      title: "Lives of Consequence",
      subtitle: "INSPIRING BIOGRAPHIES",
      description: "Walk in the shoes of giants. Explore the lives of historical figures, innovators, and artists who shaped our world.",
      badge: "Pulitzer Prize Winners",
      image: "https://images.pexels.com/photos/762041/pexels-photo-762041.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      backgroundImage: "https://images.pexels.com/photos/716411/pexels-photo-716411.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/shop?category=biography"
    }
  ];

  const slides = featuredBooks.length > 0 ? featuredBooks : heroSlides;

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000); // Increased duration for better readability

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
      <div className="relative z-10 h-full flex items-center">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-white space-y-6 animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center">
                <div className="bg-red-600 text-white px-4 py-2 rounded-full">
                  <span className="text-sm font-semibold">
                    {slides[currentSlide].badge}
                  </span>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-sm uppercase tracking-wider text-gray-300">
                {slides[currentSlide].subtitle}
              </p>

              {/* Title */}
              <h1 className="text-4xl lg:text-6xl font-serif font-bold leading-tight text-shadow-lg">
                {slides[currentSlide].title}
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                {slides[currentSlide].description}
              </p>

              {/* CTA Button */}
              <div className="pt-4">
                <Link href={slides[currentSlide].link}>
                    <button className="btn-outline text-lg px-8 py-4">
                        EXPLORE COLLECTION
                    </button>
                </Link>
              </div>
            </div>

            {/* Book Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full border-4 border-white border-opacity-20 flex items-center justify-center">
                  <img 
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].title}
                    className="w-64 h-64 lg:w-80 lg:h-80 rounded-full object-cover shadow-2xl"
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
