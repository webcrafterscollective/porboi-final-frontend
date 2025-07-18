// pages/authors.js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

const AuthorsPage = () => {
  const authors = [
    {
      id: 1,
      name: "Aanya Sharma",
      role: "Historical Fiction Novelist",
      image: "https://images.pexels.com/photos/3772510/pexels-photo-3772510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "Aanya's award-winning novels masterfully blend historical detail with gripping suspense, captivating readers worldwide."
    },
    {
      id: 2,
      name: "Rohan Mehra",
      role: "Contemporary Poet", 
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "Rohan is celebrated for his evocative poetry that explores the nuances of modern life and relationships in urban India."
    },
    {
      id: 3,
      name: "Priya Das",
      role: "Children's Book Author",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", 
      description: "Priya brings enchanting stories to life for young readers, filled with imagination, wonder, and valuable life lessons."
    },
    {
      id: 4,
      name: "Vikram Singh",
      role: "Non-Fiction Chronicler",
      image: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "Vikram's meticulously researched non-fiction makes complex historical and cultural subjects accessible and engaging."
    },
    {
      id: 5,
      name: "Isha Reddy",
      role: "Fantasy World-Builder",
      image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "Isha is renowned for creating epic fantasy worlds with intricate magic systems and unforgettable characters."
    },
    {
      id: 6,
      name: "Arjun Kumar",
      role: "Master of Mystery",
      image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "Arjun keeps readers on the edge of their seats with his cleverly plotted mysteries and shocking twists."
    },
  ];

  return (
    <>
      <Head>
        <title>Our Authors - porboi.in</title>
        <meta name="description" content="Meet the talented authors behind the captivating stories at porboi.in. Discover new voices and literary talents from India and beyond." />
      </Head>

      <div className="bg-white">
        {/* Page Header */}
        <div className="relative bg-gray-900 text-white py-20" style={{ backgroundImage: "url('https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="relative container text-center z-10">
            <h1 className="text-4xl lg:text-5xl font-serif mb-4">The Minds Behind the Stories</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              We are proud to champion a diverse community of authors, from seasoned bestsellers to brilliant emerging voices.
            </p>
          </div>
        </div>

        {/* Authors Grid */}
        <div className="section-padding container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {authors.map((author) => (
              <div key={author.id} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={author.image}
                      alt={author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 uppercase tracking-wide">
                    {author.role}
                  </p>
                  <h3 className="text-2xl font-serif text-heading">
                    {author.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {author.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50">
            <div className="section-padding container text-center">
                 <BookOpen className="w-12 h-12 text-red-600 mx-auto mb-4" />
                 <h2 className="text-3xl font-serif text-heading mb-4">Are You an Author?</h2>
                 <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                    Have a story to tell? We are always looking for new voices to join our family of authors. Learn more about our self-publishing opportunities.
                 </p>
                 <Link href="/self-publication">
                    <button className="btn-primary">
                        Submit Your Work
                    </button>
                 </Link>
            </div>
        </div>
      </div>
    </>
  );
};

export default AuthorsPage;
