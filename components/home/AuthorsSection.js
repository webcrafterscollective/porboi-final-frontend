// components/home/AuthorsSection.js
import React from 'react';

const AuthorsSection = () => {
  const authors = [
    {
      id: 1,
      name: "Elena Vance",
      role: "Bestselling Author",
      image: "https://images.pexels.com/photos/3772510/pexels-photo-3772510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "Elena's award-winning novels masterfully blend historical detail with gripping suspense, captivating readers worldwide."
    },
    {
      id: 2,
      name: "Marcus Chen",
      role: "Sci-Fi Visionary", 
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "Marcus is celebrated for his thought-provoking science fiction that explores the future of humanity and technology."
    },
    {
      id: 3,
      name: "Sofia Garcia",
      role: "Poet & Illustrator",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", 
      description: "Sofia combines lyrical poetry with stunning illustrations to create immersive and emotionally resonant collections."
    },
    {
      id: 4,
      name: "David Kim",
      role: "Non-Fiction Expert",
      image: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "David's meticulously researched non-fiction books make complex historical events accessible and engaging for all."
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-subheading mb-4">MEET OUR LITERARY TALENT</p>
          <h2 className="text-3xl lg:text-4xl font-serif text-heading mb-6">
            Featured Authors of the Month
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are proud to feature a curated selection of talented authors each month. Discover the brilliant minds behind your favorite stories and explore their captivating works.
          </p>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {authors.map((author) => (
            <div key={author.id} className="text-center group">
              {/* Author Image */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg">
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
