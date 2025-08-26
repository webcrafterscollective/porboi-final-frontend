// pages/authors.js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { api } from '../lib/api';

const AuthorsPage = ({ authors = [] }) => {
  return (
    <>
      <Head>
        <title>Our Authors - porboi.in</title>
        <meta name="description" content="Meet the talented authors behind the captivating stories at porboi.in. Discover new voices and literary talents from India and beyond." />
      </Head>

      <div className="bg-white">
        {/* Page Header */}
        <div className="relative bg-gray-900 text-white py-20" style={{ backgroundImage: "url('https://images.pexels.com/photos/256453/pexels-photo-256453.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
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
                  <h3 className="text-2xl font-serif text-heading" dangerouslySetInnerHTML={{ __html: author.name }} />
                  <p className="text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: author.description }} />
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

export async function getStaticProps() {
  try {
    const bookCategory = await api.getCategoryBySlug('book');
    let products = [];

    if (bookCategory) {
      products = await api.getProducts({ 
        category: bookCategory.id, 
        per_page: 100 
      });
    }

    const authorsMap = new Map();

    products.forEach(product => {
      let authorName = null;
      
      // Prioritize the "Book Author" attribute
      if (product.attributes && Array.isArray(product.attributes)) {
        const authorAttribute = product.attributes.find(attr => attr.name === 'Book Author');
        if (authorAttribute && authorAttribute.options.length > 0) {
          authorName = authorAttribute.options[0].trim();
        }
      }

      // Fallback to short description if attribute is not found
      if (!authorName) {
        const authorNameMatch = product.short_description.match(/<p>(.*?)<\/p>/);
        if (authorNameMatch) {
          authorName = authorNameMatch[1].trim();
        }
      }

      if (authorName && authorName !== 'Unknown Author' && !authorsMap.has(authorName)) {
        authorsMap.set(authorName, {
          id: product.id,
          name: authorName,
          role: "Author",
          image: "https://images.pexels.com/photos/753695/pexels-photo-753695.jpeg", // product.images[0]?.src || 
          description: `Author of "${product.name}"`
        });
      }
    });

    const authors = Array.from(authorsMap.values());

    return {
      props: {
        authors,
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("Failed to fetch authors:", error);
    return {
      props: {
        authors: [],
      },
    };
  }
}

export default AuthorsPage;