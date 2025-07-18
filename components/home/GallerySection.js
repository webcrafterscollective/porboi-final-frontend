// components/home/GallerySection.js (for the image grid shown in your screenshots)
import React from 'react';

const GallerySection = () => {
  const galleryImages = [
    { id: 1, src: "/images/gallery-1.jpg", alt: "Louvre Museum", size: "large" },
    { id: 2, src: "/images/gallery-2.jpg", alt: "Gallery visitor", size: "medium" },
    { id: 3, src: "/images/gallery-3.jpg", alt: "Street art", size: "medium" },
    { id: 4, src: "/images/gallery-4.jpg", alt: "Person with umbrella", size: "medium" },
    { id: 5, src: "/images/gallery-5.jpg", alt: "Business meeting", size: "medium" },
    { id: 6, src: "/images/gallery-6.jpg", alt: "Imagine design", size: "small" },
    { id: 7, src: "/images/gallery-7.jpg", alt: "Architecture", size: "large" },
    { id: 8, src: "/images/gallery-8.jpg", alt: "Workspace", size: "medium" },
    { id: 9, src: "/images/gallery-9.jpg", alt: "Library", size: "medium" },
    { id: 10, src: "/images/gallery-10.jpg", alt: "Reading", size: "medium" },
    { id: 11, src: "/images/gallery-11.jpg", alt: "Books", size: "medium" }
  ];

  return (
    <section className="py-0 bg-white">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1">
        {galleryImages.map((image) => (
          <div 
            key={image.id} 
            className={`relative overflow-hidden group cursor-pointer ${
              image.size === 'large' ? 'col-span-2 row-span-2' : 
              image.size === 'medium' ? 'col-span-1 row-span-1' : 
              'col-span-1 row-span-1'
            }`}
          >
            <div className="aspect-square">
              {image.src ? (
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">📷</span>
                </div>
              )}
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GallerySection;