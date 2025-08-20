// components/home/ProductGridSection.js
import React from 'react';
import ProductCard from '../shop/ProductCard';
import Link from 'next/link';

const ProductGridSection = ({ title, products, link }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif text-heading">{title}</h2>
          {link && (
            <Link href={link}>
              <span className="text-red-600 font-semibold hover:underline">View All &rarr;</span>
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGridSection;