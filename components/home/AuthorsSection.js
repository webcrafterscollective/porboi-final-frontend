// components/home/AuthorsSection.js
import React from 'react';

const AuthorsSection = () => {
  const authors = [
    {
      id: 1,
      name: "Adam Strass",
      role: "AUTHOR",
      image: "/images/author-1.jpg",
      description: "Except sint occaecat cupidatat non proident, sunt culpa qui officia deserunt mollit."
    },
    {
      id: 2,
      name: "Jennifer Doe",
      role: "DESIGNER", 
      image: "/images/author-2.jpg",
      description: "Except sint occaecat cupidatat non proident, sunt culpa qui officia deserunt mollit."
    },
    {
      id: 3,
      name: "James Coleman",
      role: "CONSULTANT",
      image: "/images/author-3.jpg", 
      description: "Except sint occaecat cupidatat non proident, sunt culpa qui officia deserunt mollit."
    },
    {
      id: 4,
      name: "Linda Heyes",
      role: "SUPPORT",
      image: "/images/author-4.jpg",
      description: "Except sint occaecat cupidatat non proident, sunt culpa qui officia deserunt mollit."
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-subheading mb-4">OUR SERVICES</p>
          <h2 className="text-3xl lg:text-4xl font-serif text-heading mb-6">
            Authors of the month
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {authors.map((author) => (
            <div key={author.id} className="text-center group">
              {/* Author Image */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden">
                  {author.image ? (
                    <img
                      src={author.image}
                      alt={author.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-4xl">👤</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Author Info */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  {author.role}
                </p>
                <h3 className="text-xl font-serif text-heading">
                  {author.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {author.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AuthorsSection;