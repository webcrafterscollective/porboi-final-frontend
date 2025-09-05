// pages/publishers.js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { api } from '../lib/api';

const PublishersPage = ({ publishers = [] }) => {
  return (
    <>
      <Head>
        <title>Our Publishers - porboi.in</title>
        <meta name="description" content="Discover the esteemed publishing houses we partner with to bring you the best books from India and around the world." />
      </Head>

      <div className="bg-white">
        {/* Page Header */}
        <div className="relative bg-gray-900 text-white py-20" style={{ backgroundImage: "url('https://images.pexels.com/photos/2908975/pexels-photo-2908975.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            <div className="relative container text-center z-10">
                <h1 className="text-4xl lg:text-5xl font-serif mb-4">Our Publishing Partners</h1>
                <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                We collaborate with the most respected publishers to curate a diverse and high-quality collection for our readers.
                </p>
            </div>
        </div>

        {/* Publishers Grid */}
        <div className="section-padding container">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {publishers.map((publisher) => (
                    <Link key={publisher.id} href={`/shop?publisher=${publisher.slug}`}>
                        <div className="group relative block bg-black rounded-lg overflow-hidden">
                            <img alt={publisher.name} src={publisher.image} className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-50" />
                            <div className="relative p-8">
                                <p className="text-2xl font-bold text-white font-serif">{publisher.name}</p>
                                <div className="mt-64">
                                    <div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                                        <p className="text-sm text-white">
                                            Explore titles from {publisher.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gray-50">
            <div className="section-padding container text-center">
                 <Briefcase className="w-12 h-12 text-red-600 mx-auto mb-4" />
                 <h2 className="text-3xl font-serif text-heading mb-4">Become a Publishing Partner</h2>
                 <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                    Are you a publisher interested in featuring your titles in our store? We'd love to hear from you. Reach out to discuss partnership opportunities.
                 </p>
                 <Link href="/contact">
                    <button className="btn-primary">
                        Get In Touch
                    </button>
                 </Link>
            </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  try {
    const attributes = await api.getAttributes();
    const publisherAttr = attributes.find(attr => attr.name === 'Publisher');
    
    let publishers = [];
    if (publisherAttr) {
      const publisherTerms = await api.getAttributeTerms(publisherAttr.id, { per_page: 100, orderby: 'name', order: 'asc' });
      publishers = publisherTerms.map(term => ({
          id: term.id,
          name: term.name,
          slug: term.slug,
          image: 'https://images.pexels.com/photos/357514/pexels-photo-357514.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      }));
    }

    return {
      props: {
        publishers,
      },
    };
  } catch (error) {
    console.error("Failed to fetch publishers:", error);
    return {
      props: {
        publishers: [],
      },
    };
  }
}

export default PublishersPage;