// components/home/GallerySection.js (for the image grid shown in your screenshots)
import React from 'react';

const GallerySection = () => {
  const galleryImages = [
    { id: 1, src: "https://images.pexels.com/photos/220327/pexels-photo-220327.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Old library with many books", size: "large" },
    { id: 2, src: "https://images.pexels.com/photos/3747486/pexels-photo-3747486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Student reading in a library", size: "medium" },
    { id: 3, src: "https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Close-up of book pages", size: "medium" },
    { id: 4, src: "https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Aisle in a modern bookstore", size: "medium" },
    { id: 5, src: "https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Person writing in a notebook", size: "medium" },
    { id: 6, src: "https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Close-up of a classic book cover", size: "small" },
    { id: 7, src: "https://images.pexels.com/photos/1106468/pexels-photo-1106468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Person holding an open book", size: "large" },
    { id: 8, src: "https://images.pexels.com/photos/34076/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Antique books on a shelf", size: "medium" },
    { id: 9, src: "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Modern library interior", size: "medium" },
    { id: 10, src: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Woman browsing a bookshelf", size: "medium" },
    { id: 11, src: "https://images.pexels.com/photos/207732/pexels-photo-207732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Stack of colorful books", size: "medium" }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container">
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
      </div>
    </section>
  );
};

export default GallerySection;
