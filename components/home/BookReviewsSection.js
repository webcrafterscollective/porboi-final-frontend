// components/home/BookReviewsSection.js
import React from 'react';
import { getAllReviews } from '../../lib/reviews';

const BookReviewsSection = () => {
  // Get all reviews and then select only the first one
  const reviews = getAllReviews().slice(0, 1);

  return (
    <section className="section-padding bg-white">
      <div className="container">
          {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-subheading mb-4">From Our Readers</p>
          <h2 className="text-3xl lg:text-4xl font-serif text-heading mb-6">
            Book Reviews
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            
          </p>
        </div>

        {/* Full Reviews Layout */}
        <div className="space-y-20">
          {reviews.map((review, index) => (
            <div 
              key={review.id} 
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Image Column */}
              <div className={`w-full ${index % 2 === 1 ? 'md:order-last' : ''}`}>
                <img
                  src={review.coverImage}
                  alt={review.bookTitle}
                  className="w-full h-auto object-contain rounded-lg shadow-lg max-w-sm mx-auto"
                />
              </div>

              {/* Text Column */}
              <div className="w-full">
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {review.author}
                </p>
                <h3 className="text-3xl font-serif text-heading mt-2 mb-4">
                  {review.bookTitle}
                </h3>
                <div 
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: review.fullReview }}
                />
                <footer className="mt-4 text-md font-semibold text-gray-600">
                  - {review.reviewer}
                </footer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookReviewsSection;