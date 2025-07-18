// components/home/BookReviewsSection.js
import React from 'react';
import Link from 'next/link';

const BookReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      bookTitle: "The Crimson Cipher",
      author: "By Elena Vance",
      reviewExcerpt: "A masterful thriller that weaves history and suspense into an unforgettable narrative. 'The Crimson Cipher' is a must-read for fans of the genre.",
      reviewer: "Literary Gazette",
      coverImage: "https://images.pexels.com/photos/1314544/pexels-photo-1314544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/blog/crimson-cipher-review"
    },
    {
      id: 2,
      bookTitle: "Echoes of Tomorrow",
      author: "By Marcus Chen",
      reviewExcerpt: "Chen's latest sci-fi epic is a profound exploration of humanity's future. A truly visionary work that will stay with you long after you finish.",
      reviewer: "The Futurist Review",
      coverImage: "https://images.pexels.com/photos/2177013/pexels-photo-2177013.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/blog/echoes-of-tomorrow-review"
    },
    {
      id: 3,
      bookTitle: "Where the River Bends",
      author: "By Sofia Garcia",
      reviewExcerpt: "A beautifully written, heart-wrenching tale of love and loss. Garcia's prose is as poetic as the verses she's known for. A stunning debut novel.",
      reviewer: "Reader's Monthly",
      coverImage: "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/blog/where-the-river-bends-review"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-subheading mb-4">CRITICS' CORNER</p>
          <h2 className="text-3xl lg:text-4xl font-serif text-heading mb-6">
            Pre-Order Book Reviews
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get an exclusive look at the most anticipated books before they hit the shelves. Here's what the critics are saying about upcoming releases you can pre-order today.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg overflow-hidden flex flex-col group">
              <div className="relative">
                <img
                  src={review.coverImage}
                  alt={review.bookTitle}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                  {review.author}
                </p>
                <h3 className="text-xl font-serif text-heading mb-4">
                  {review.bookTitle}
                </h3>
                <blockquote className="text-gray-600 text-sm leading-relaxed border-l-4 border-red-200 pl-4 mb-4 flex-grow">
                  "{review.reviewExcerpt}"
                  <footer className="mt-2 text-xs font-semibold text-gray-500">- {review.reviewer}</footer>
                </blockquote>
                <div className="mt-auto">
                  <Link href={review.link}>
                    <button className="w-full btn-secondary text-center text-sm">
                      Read Full Review
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookReviewsSection;
