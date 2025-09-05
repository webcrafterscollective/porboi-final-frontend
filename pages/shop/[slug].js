// pages/shop/[slug].js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCart, Heart, Share2, Star, BookOpen, Package } from 'lucide-react';
import { api } from '../../lib/api';
import { cartUtils } from '../../utils/cartUtils';
import { toast } from 'react-hot-toast';
import { formatPrice } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProductCard from '../../components/shop/ProductCard';

// --- Sub-components for better organization ---

const ProductImageGallery = ({ images, productName }) => {
    const [selectedImage, setSelectedImage] = React.useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[2/3] bg-gray-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-gray-300" />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            {/* Main Image */}
            <div className="w-full max-w-sm bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-[2/3] w-full">
                    <img
                        src={images[selectedImage]?.src}
                        alt={productName}
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex mt-4 gap-2 justify-center">
                    {images.map((img, index) => (
                        <button 
                            key={img.id || index} 
                            onClick={() => setSelectedImage(index)} 
                            className={`block w-20 h-auto aspect-[2/3] bg-gray-100 rounded-md overflow-hidden transition-all duration-200 ${selectedImage === index ? 'ring-2 ring-red-600 ring-offset-2' : 'hover:opacity-80'}`}
                        >
                            <img
                                src={img.src}
                                alt={`${productName} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const ProductDetails = ({ product, quantity, setQuantity, onAddToCart, onWishlistToggle, isWishlisted, isLoading }) => {
    const { name, on_sale, regular_price, sale_price, price, short_description, reviews, stock_quantity, tax_status, tax_class } = product;
    
    const averageRating = reviews?.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title: name, text: short_description, url: window.location.href });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    return (
        <div>
            <h1 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-2">{name}</h1>
            <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className={i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                    ))}
                </div>
                <span className="text-gray-500 text-sm">({reviews?.length || 0} reviews)</span>
            </div>

            <div className="text-2xl font-semibold text-gray-800 mb-4">
                {on_sale ? (
                    <>
                        <span className="text-red-600 mr-2">{formatPrice(sale_price)}</span>
                        <span className="line-through text-gray-400 text-lg">{formatPrice(regular_price)}</span>
                    </>
                ) : (
                    <span>{formatPrice(price)}</span>
                )}
            </div>

            <p className="text-gray-600 mb-6" dangerouslySetInnerHTML={{ __html: short_description }} />

            <div className="flex items-center gap-4 mb-6">
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} min="1" className="w-20 text-center border rounded-md px-2 py-3" />
                <button onClick={onAddToCart} disabled={isLoading} className="flex-1 btn-primary flex items-center justify-center gap-2 py-3">
                    <ShoppingCart size={18} />
                    {isLoading ? 'Adding...' : 'Add to Cart'}
                </button>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
                <button onClick={onWishlistToggle} className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
                    <Heart size={16} className={`mr-2 ${isWishlisted ? 'text-red-500 fill-current' : ''}`} />
                    {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
                </button>
                 <button onClick={handleShare} className="flex items-center text-sm text-gray-600 hover:text-red-600 transition-colors">
                    <Share2 size={16} className="mr-2" />
                    Share
                </button>
            </div>

             {/* Stock and Tax Info */}
            <div className="border-t pt-4 space-y-2">
                {stock_quantity !== null && (
                    <div className="flex items-center text-sm text-gray-600">
                        <Package size={16} className="mr-2" />
                        <span>{stock_quantity} in stock</span>
                    </div>
                )}
                {tax_status && (
                    <div className="flex items-center text-sm text-gray-600">
                         <span className="font-medium mr-2">Tax Status:</span> 
                         <span className="capitalize">{tax_status}</span>
                         {tax_class && tax_class !== '' && <span className="ml-1">({tax_class})</span>}
                    </div>
                )}
            </div>
        </div>
    );
};

const ProductTabs = ({ description, attributes }) => {
    const [activeTab, setActiveTab] = React.useState('description');
    
    return (
        <div className="mt-16">
            <div className="flex gap-6 border-b mb-6">
                <button onClick={() => setActiveTab('description')} className={`pb-2 text-lg font-medium ${activeTab === 'description' ? 'border-b-2 border-red-600 text-gray-900' : 'text-gray-500'}`}>
                    Description
                </button>
                <button onClick={() => setActiveTab('additional')} className={`pb-2 text-lg font-medium ${activeTab === 'additional' ? 'border-b-2 border-red-600 text-gray-900' : 'text-gray-500'}`}>
                    Additional Info
                </button>
            </div>

            {activeTab === 'description' && (
                <div dangerouslySetInnerHTML={{ __html: description }} className="prose max-w-none" />
            )}
            {activeTab === 'additional' && (
                <div className="text-gray-700">
                    <ul className="space-y-2">
                        {attributes?.map((attr) => (
                            <li key={attr.id} className="grid grid-cols-3 gap-4">
                                <strong className="col-span-1">{attr.name}:</strong> 
                                <span className="col-span-2">{attr.options.join(', ')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const RelatedProducts = ({ products }) => {
    if (!products || products.length === 0) return null;
    
    return (
        <div className="mt-20 pt-16 border-t">
            <h2 className="text-3xl font-serif text-center text-heading mb-12">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {products.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                ))}
            </div>
        </div>
    );
};

// --- Main Page Component ---

const ProductPage = ({ product, relatedProducts, error }) => {
  const router = useRouter();
  const [quantity, setQuantity] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  if (router.isFallback) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="large" text="Loading product..." /></div>;
  }

  if (error || !product) {
    return (
      <div className="container section-padding text-center">
        <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-4">{error || "The product you are looking for does not exist."}</p>
        <Link href="/shop"><button className="btn-primary">Back to Shop</button></Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsLoading(true);
    try {
      cartUtils.addToCart(product, quantity);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      toast.success(`${product.name} added to cart!`);
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
  
  const ogImage = product.images?.[0]?.src || 'https://porboi.in/og-image.jpg';
  const pageUrl = `https://porboi.in/shop/${product.slug}`;


  return (
    <>
      <Head>
        <title>{product.name} | porboi.in</title>
        <meta name="description" content={product.short_description.replace(/<[^>]*>?/gm, '')} />
        
        {/* --- Open Graph Meta Tags for Product Sharing --- */}
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.short_description.replace(/<[^>]*>?/gm, '')} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* --- End of OG Tags --- */}
      </Head>

      <div className="container section-padding">
        <div className="grid md:grid-cols-2 gap-12">
          <ProductImageGallery images={product.images} productName={product.name} />
          <ProductDetails 
            product={product} 
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
            onWishlistToggle={handleWishlistToggle}
            isWishlisted={isWishlisted}
            isLoading={isLoading}
          />
        </div>
        <ProductTabs description={product.description} attributes={product.attributes} />
        <RelatedProducts products={relatedProducts} />
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { params } = context;
  try {
    const product = await api.getProductBySlug(params.slug);
    
    if (!product) {
      return { notFound: true };
    }

    const relatedProducts = await api.getRelatedProducts(product.id);

    return {
      props: {
        product,
        relatedProducts,
      },
    };
  } catch (error) {
    console.error(`Error fetching product for slug: ${params.slug}`, error);
    // You can either return a notFound or pass an error prop to the page
    return { 
        props: {
            error: `Could not load product data. Please try again later.`
        }
    };
  }
}

export default ProductPage;