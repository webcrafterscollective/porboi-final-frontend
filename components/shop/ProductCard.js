// components/shop/ProductCard.js
import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { cartUtils } from '../../utils/cartUtils';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Extract product data
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
    short_description
  } = product;

  // Get first image or placeholder
  const primaryImage = images[0]?.src || 'https://placehold.co/400x300/d1b7a0/5c3a21?text=Porboi';
  const secondaryImage = images[1]?.src || primaryImage;

  // Calculate discount percentage
  const discountPercentage = on_sale && regular_price 
    ? Math.round(((regular_price - sale_price) / regular_price) * 100)
    : 0;

  // Get author from short_description or categories
  const author = short_description || categories[0]?.name || 'Unknown Author';

  // Handle add to cart
  const handleAddToCart = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add to local cart
      cartUtils.addToCart(product, 1);
      
      // Dispatch custom event to update cart count in header
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      toast.success(`${name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  // Generate product URL
  const productUrl = `/shop/${product.slug || id}`;

  return (
    <div className="product-card group flex flex-col h-full">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <Link href={productUrl}>
          <div className="relative aspect-[4/3] bg-gray-100">
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

        {/* Product Badges */}
        <div className="absolute top-2 left-2 space-y-1">
          {stock_status === 'outofstock' && (
            <span className="product-badge badge-sold">SOLD</span>
          )}
          {stock_status === 'instock' && categories.some(cat => cat.name === 'New') && (
            <span className="product-badge badge-new">NEW</span>
          )}
          {on_sale && (
            <span className="product-badge badge-sale">
              SALE {discountPercentage > 0 ? `-${discountPercentage}%` : ''}
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
          <button
            onClick={handleWishlistToggle}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isWishlisted 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-red-600 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          
          <Link href={productUrl}>
            <button className="w-10 h-10 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors duration-200">
              <Eye className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Add to Cart Button - Shows on Hover */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          {stock_status === 'outofstock' ? (
            <button 
              disabled
              className="w-full bg-gray-400 text-white py-3 font-medium cursor-not-allowed"
            >
              OUT OF STOCK
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isLoading ? 'ADDING...' : 'ADD TO CART'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="product-card-content flex-grow flex flex-col">
        <div className="flex-grow">
            {/* Author */}
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
            {author}
            </p>

            {/* Product Name */}
            <Link href={productUrl}>
            <h3 className="text-lg font-serif text-heading mb-2 hover:text-red-600 transition-colors duration-200 line-clamp-2">
                {name}
            </h3>
            </Link>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mt-2">
          {on_sale ? (
            <>
              <span className="text-price text-red-600">₹{sale_price}</span>
              <span className="text-price-old">₹{regular_price}</span>
            </>
          ) : (
            <span className="text-price">₹{price}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
