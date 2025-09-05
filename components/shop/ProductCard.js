// components/shop/ProductCard.js
import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { cartUtils } from '../../utils/cartUtils';
import { toast } from 'react-hot-toast';
import { formatPrice } from '../../utils/formatters'; // Make sure you have this formatter

// Utility: safely render WooCommerce HTML with fallback
const renderHtml = (html) => {
  return { __html: html || ' ' };
};

const ProductCard = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const {
    id,
    name,
    price,
    regular_price,
    sale_price,
    images = [],
    stock_status,
    on_sale,
    categories = [],
    short_description,
    slug,
    attributes = [],
  } = product;

  // --- Check if the product is a book ---
  const isBook = categories.some(cat => cat.slug === 'book');

  const primaryImage =
    images[0]?.src || 'https://placehold.co/400x300/d1b7a0/5c3a21?text=Porboi';
  const secondaryImage = images[1]?.src || primaryImage;

  const discountPercentage =
    on_sale && regular_price && sale_price
      ? Math.round(((regular_price - sale_price) / regular_price) * 100)
      : 0;

  const authorAttribute = attributes.find(attr => attr.name === 'Book Author');
  const authorName = authorAttribute ? authorAttribute.options.join(', ') : null;

  const authorOrCategory =
    authorName || short_description || categories[0]?.name || 'Unknown Author';

  const handleAddToCart = (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      cartUtils.addToCart(product, 1);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const productUrl = `/shop/${slug || id}`;

  // --- Render the simplified card if it's a book ---
  if (isBook) {
    return (
      <Link href={productUrl} className="product-card group flex flex-col h-full">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <div className="relative aspect-square bg-gray-100">
            <img
              src={primaryImage}
              alt={name}
              className="product-card-image"
            />
          </div>
        </div>
        {/* Product Content */}
        <div className="product-card-content flex-grow flex flex-col justify-between">
          <div>
            <h3
              className="text-lg font-serif text-heading mb-1 group-hover:text-red-600 transition-colors duration-200 line-clamp-2"
              dangerouslySetInnerHTML={renderHtml(name)}
            />
            {authorName && (
              <div
                className="text-sm text-gray-500 mb-4"
                dangerouslySetInnerHTML={renderHtml(authorName)}
              ></div>
            )}
          </div>
          {/* Price */}
          <div className="mt-auto">
            <div className="bg-blue-50 inline-block px-4 py-2 rounded-lg">
              {on_sale ? (
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-bold text-blue-600">{formatPrice(sale_price)}</span>
                  <span className="text-sm text-gray-500 line-through">{formatPrice(regular_price)}</span>
                </div>
              ) : (
                <span className="text-xl font-bold text-blue-600">{formatPrice(price)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // --- Render the full-featured card for all other products ---
  return (
    <div className="product-card group flex flex-col h-full">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <Link href={productUrl}>
          <div className="relative aspect-square bg-gray-100">
            <img
              src={primaryImage}
              alt={name}
              className="product-card-image absolute inset-0 opacity-100 group-hover:opacity-0 transition-opacity duration-300"
            />
            <img
              src={secondaryImage}
              alt={name}
              className="product-card-image absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </Link>
        {/* Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {stock_status === 'outofstock' && (
            <span className="product-badge badge-sold">SOLD</span>
          )}
          {on_sale && (
            <span className="product-badge badge-sale">
              SALE {discountPercentage > 0 ? `-${discountPercentage}%` : ''}
            </span>
          )}
        </div>
        {/* Hover Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
          <button onClick={handleWishlistToggle} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${isWishlisted ? 'bg-red-600 text-white' : 'bg-white text-gray-600 hover:bg-red-600 hover:text-white'}`}>
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <Link href={productUrl}>
            <button className="w-10 h-10 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors duration-200">
              <Eye className="w-4 h-4" />
            </button>
          </Link>
        </div>
        {/* Add to Cart */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          {stock_status === 'outofstock' ? (
            <button disabled className="w-full bg-gray-400 text-white py-3 font-medium cursor-not-allowed">OUT OF STOCK</button>
          ) : (
            <button onClick={handleAddToCart} disabled={isLoading} className="w-full bg-red-600 text-white py-3 font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>{isLoading ? 'ADDING...' : 'ADD TO CART'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Content */}
      <div className="product-card-content flex-grow flex flex-col justify-between">
        <div>
          <Link href={productUrl}>
            <h3 className="text-lg font-serif text-heading mb-1 hover:text-red-600 transition-colors duration-200 line-clamp-2" dangerouslySetInnerHTML={renderHtml(name)} />
          </Link>
          <div className="text-sm text-gray-500 mb-4" dangerouslySetInnerHTML={renderHtml(authorOrCategory)}></div>
        </div>
        {/* Price */}
        <div className="mt-auto">
          <div className="bg-blue-50 inline-block px-4 py-2 rounded-lg">
            {on_sale ? (
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-bold text-blue-600">{formatPrice(sale_price)}</span>
                <span className="text-sm text-gray-500 line-through">{formatPrice(regular_price)}</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-blue-600">{formatPrice(price)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;