// pages/fashion.js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Camera, Feather, BookOpen } from 'lucide-react';
import { api } from '../lib/api';

const FashionPage = ({ fashionPosts }) => {
  const galleryImages = [
    { src: "https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Woman in stylish outfit" },
    { src: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Close-up of a fashion model" },
    { src: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Men's fashion flat lay" },
    { src: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Man in a leather jacket" },
    { src: "https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Woman in a colorful dress" },
    { src: "https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Fashion accessories" },
  ];

  return (
    <>
      <Head>
        <title>Fashion & Style - ChapterOne Bookstore</title>
        <meta name="description" content="Explore the intersection of literature and fashion. Discover style guides, designer biographies, and the stories behind the trends." />
      </Head>

      <div className="bg-white">
        {/* Page Header */}
        <div className="relative bg-gray-900 text-white py-24" style={{ backgroundImage: "url('https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="relative container text-center z-10">
            <h1 className="text-4xl lg:text-5xl font-serif mb-4">Style & Stories</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Where the narrative of fashion meets the art of literature. Explore trends, icons, and the timeless connection between style and storytelling.
            </p>
          </div>
        </div>

        {/* Curated Gallery Section */}
        <div className="section-padding container">
            <h2 className="text-3xl font-serif text-center text-heading mb-12">Visual Diary: A Curated Gallery</h2>
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {galleryImages.map((image, index) => (
                    <div key={index} className="overflow-hidden rounded-lg shadow-md break-inside-avoid">
                        <img src={image.src} alt={image.alt} className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300" />
                    </div>
                ))}
            </div>
        </div>

        {/* Fashion Articles Section */}
        <div className="bg-gray-50">
            <div className="section-padding container">
                <h2 className="text-3xl font-serif text-center text-heading mb-12">From Our Fashion Desk</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {fashionPosts.length > 0 ? fashionPosts.map(post => (
                        <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                            <Link href={`/blog/${post.slug}`}>
                                <div className="aspect-w-16 aspect-h-9">
                                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                                    <h3 className="text-xl font-serif text-heading mb-3 group-hover:text-red-600 transition-colors">{post.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                                    <span className="text-red-600 font-semibold text-sm hover:underline">Read More &rarr;</span>
                                </div>
                            </Link>
                        </div>
                    )) : (
                        <p className="col-span-full text-center text-gray-600">Fashion articles are coming soon. Stay tuned!</p>
                    )}
                </div>
            </div>
        </div>
        
        {/* CTA Section */}
        <div className="section-padding container text-center">
             <BookOpen className="w-12 h-12 text-red-600 mx-auto mb-4" />
             <h2 className="text-3xl font-serif text-heading mb-4">Read the Look</h2>
             <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                From iconic designer biographies to in-depth histories of couture, our collection has the perfect read for every fashion enthusiast.
             </p>
             <Link href="/shop?category=fashion">
                <button className="btn-primary">
                    Shop Fashion Books
                </button>
             </Link>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps() {
  // Fetch posts from the "Fashion" category
  // const fashionPosts = await api.getPostsByCategory('fashion');

  const mockPosts = [
    { id: 1, slug: 'history-of-denim', title: 'The Enduring Legacy of Denim', date: 'July 15, 2025', excerpt: 'From workwear staple to high-fashion icon, we trace the timeless journey of denim through the decades.', image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 2, slug: 'vintage-scarves-101', title: 'How to Style a Vintage Scarf: A Timeless Accessory', date: 'July 10, 2025', excerpt: 'Unlock the versatility of the silk scarf. We explore classic and modern ways to incorporate this chic accessory into your wardrobe.', image: 'https://images.pexels.com/photos/1878821/pexels-photo-1878821.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { id: 3, slug: 'biography-coco-chanel', title: 'The Woman Who Built an Empire: A Look at Coco Chanel', date: 'July 5, 2025', excerpt: 'Beyond the little black dress. Dive into the life of the revolutionary designer who changed fashion forever.', image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  ];

  return {
    props: {
      fashionPosts: mockPosts, // Replace with 'fashionPosts' once API is ready
    },
    revalidate: 3600,
  };
}

export default FashionPage;
