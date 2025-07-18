// pages/shop/[slug].js - Individual Product Page
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import { cartUtils } from '../../utils/cartUtils';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProductCard from '../../components/shop/ProductCard';

const ProductPage = ({ product, relatedProducts }) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  if (router.isFallback) {
    return <LoadingSpinner size="large" text="Loading product..." />;
  }

  if (!product) {
    return (
      <div className="container section-padding text-center">
        <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
        <Link href="/shop">
          <button className="btn-primary">Back to Shop</button>
        </Link>
      </div>
    );
  }

  const {
    id,
    name,
    price,
    regular_price,
    sale_price,
    description,
    short_description,
    images = [],
    stock_status,
    on_sale,
    categories = [],
    attributes = [],
    reviews = []
  } = product;

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      cartUtils.addToCart(product, quantity);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      toast.success(`${name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: short_description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const features = [
    { icon: Truck, text: 'Free shipping over $50' },
    { icon: Shield, text: '30-day return policy' },
    { icon: RefreshCw, text: 'Easy exchanges' }
  ];

  return (
    <>
      <Head>
        <title>{name} | Bookstore</title>
        <meta name="description" content={short_description} />
      </Head>

      <div className="container section-padding">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <img
              src={images[selectedImage]?.src}
              alt={name}
              className="rounded-lg w-full object-cover"
            />
            <div className="flex mt-4 gap-2">
              {images.map((img, index) => (
                <img
                  key={img.id || index}
                  src={img.src}
                  alt=""
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 w-20 rounded-md cursor-pointer border ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{name}</h1>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < averageRating ? 'gold' : 'none'} />
              ))}
              <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
            </div>

            <div className="text-xl font-semibold text-primary mb-2">
              {on_sale ? (
                <>
                  <span className="line-through mr-2 text-gray-400">${regular_price}</span>
                  <span>${sale_price}</span>
                </>
              ) : (
                <span>${price}</span>
              )}
            </div>

            <p className="text-gray-700 mb-4">{short_description}</p>

            {/* Quantity + Actions */}
            <div className="flex items-center gap-4 mb-6">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                min="1"
                className="w-16 text-center border rounded px-2 py-1"
              />
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="btn-primary flex items-center gap-2"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button onClick={handleWishlistToggle} className="btn-icon">
                <Heart size={18} color={isWishlisted ? 'red' : 'gray'} />
              </button>
              <button onClick={handleShare} className="btn-icon">
                <Share2 size={18} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
              {features.map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Icon size={20} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description / Additional Info Tabs */}
        <div className="mt-12">
          <div className="flex gap-6 border-b mb-4">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-2 ${activeTab === 'description' ? 'border-b-2 border-primary font-semibold' : 'text-gray-500'}`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('additional')}
              className={`pb-2 ${activeTab === 'additional' ? 'border-b-2 border-primary font-semibold' : 'text-gray-500'}`}
            >
              Additional Info
            </button>
          </div>

          {activeTab === 'description' && (
            <div dangerouslySetInnerHTML={{ __html: description }} className="prose" />
          )}
          {activeTab === 'additional' && (
            <div className="text-gray-700">
              <ul>
                {attributes.map((attr) => (
                  <li key={attr.id}>
                    <strong>{attr.name}:</strong> {attr.options.join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export async function getStaticPaths() {
  const products = await api.getAllProductSlugs();
  const paths = products.map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: true, // or 'blocking' if you want SSR behavior
  };
}

export async function getStaticProps({ params }) {
  try {
    const product = await api.getProductBySlug(params.slug);
    const relatedProducts = await api.getRelatedProducts(product.id);

    return {
      props: {
        product,
        relatedProducts,
      },
      revalidate: 60, // ISR every 60s
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      props: {
        product: null,
        relatedProducts: [],
      },
      revalidate: 60,
    };
  }
}

export default ProductPage;
