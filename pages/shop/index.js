// pages/shop/index.js
import React from 'react';
import Head from 'next/head';
import ProductGrid from '../../components/shop/ProductGrid';
import { api, wooCommerceApi } from '../../lib/api';
import { Book } from 'lucide-react';

const ShopPage = ({ products, categories, totalPages, currentPage, categoryFromSlug, totalProducts }) => {
  // Function to safely render HTML content from titles
  const renderHTML = (htmlString) => ({ __html: htmlString });

  const pageTitle = categoryFromSlug ? categoryFromSlug.name : "All Products - porboi.in";
  const pageDescription = categoryFromSlug 
    ? `Browse all books in the ${categoryFromSlug.name} category.` 
    : "Explore our complete collection of books and accessories.";

  return (
    <>
      <Head>
        <title dangerouslySetInnerHTML={renderHTML(pageTitle)} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="bengali books, online bookstore, kolkata bookstore, indian literature" />
      </Head>

      <div className="bg-gray-50 border-b border-gray-200 py-24">
        <div className="container text-center">
          <div className="inline-block bg-red-100 text-red-600 p-4 rounded-full mb-4">
            <Book className="w-8 h-8" />
          </div>
          <h1 
            className="text-4xl lg:text-5xl font-serif text-gray-900 mb-4"
            dangerouslySetInnerHTML={renderHTML(categoryFromSlug ? categoryFromSlug.name : 'All Products')}
          />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Showing {products.length} of {totalProducts} products.
          </p>
        </div>
      </div>

      <ProductGrid
        key={categoryFromSlug ? categoryFromSlug.id : 'all-products'}
        products={products}
        categories={categories}
        totalPages={totalPages}
        currentPage={currentPage}
        totalProducts={totalProducts}
      />
    </>
  );
};

export async function getServerSideProps(context) {
  const { query } = context;
  const {
    category_slug,
    page = 1,
    sortBy,
    priceRange,
    inStock,
    onSale,
  } = query;
  
  let categoryFromSlug = null;
  let categoriesForFilter = [];
  const productsPerPage = 12;

  try {
    const allCategories = await api.getCategories({ per_page: 100, orderby: 'name', order: 'asc' }) || [];

    const productParams = {
      per_page: productsPerPage,
      page: parseInt(page, 10),
    };

    // Handle all filters by adding them to the API request params
    if (category_slug) {
      categoryFromSlug = allCategories.find(c => c.slug === category_slug) || null;
      if (categoryFromSlug) {
        productParams.category = categoryFromSlug.id;
        const subCategories = allCategories.filter(c => c.parent === categoryFromSlug.id && c.count > 0);
        categoriesForFilter = [categoryFromSlug, ...subCategories];
      }
    } else {
      categoriesForFilter = allCategories.filter(c => c.parent === 0 && c.count > 0);
    }
    
    if (onSale === 'true') productParams.on_sale = true;
    if (inStock === 'true') productParams.stock_status = 'instock';
    if (priceRange) {
      const [min, max] = priceRange.split('-');
      productParams.min_price = min;
      productParams.max_price = max;
    }
    
    if (sortBy) {
        switch (sortBy) {
            case 'price-asc':
              productParams.orderby = 'price';
              productParams.order = 'asc';
              break;
            case 'price-desc':
              productParams.orderby = 'price';
              productParams.order = 'desc';
              break;
            case 'name-asc':
              productParams.orderby = 'title';
              productParams.order = 'asc';
              break;
            case 'popularity':
              productParams.orderby = 'popularity';
              productParams.order = 'desc';
              break;
            default:
              productParams.orderby = 'date';
              productParams.order = 'desc';
        }
    }

    const response = await wooCommerceApi.get('/products', { params: productParams });
    const products = response.data;
    const totalProducts = parseInt(response.headers['x-wp-total'], 10);
    const totalPages = parseInt(response.headers['x-wp-totalpages'], 10);

    return {
      props: {
        products,
        categories: categoriesForFilter,
        totalPages,
        currentPage: parseInt(page, 10),
        totalProducts,
        categoryFromSlug,
      },
    };
  } catch (error) {
    console.error('Error fetching shop data:', error.message);
    return {
      props: { products: [], categories: [], totalPages: 1, currentPage: 1, totalProducts: 0, categoryFromSlug: null },
    };
  }
}

export default ShopPage;