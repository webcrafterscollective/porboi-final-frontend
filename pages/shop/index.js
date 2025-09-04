// // pages/shop/index.js
// import React from 'react';
// import Head from 'next/head';
// import Link from 'next/link';
// import ProductGrid from '../../components/shop/ProductGrid';
// import { api, wooCommerceApi } from '../../lib/api';
// import { Book, ChevronRight } from 'lucide-react';

// const ShopPage = ({ products, categories, totalPages, currentPage, categoryFromSlug, totalProducts }) => {
//   // Function to safely render HTML content from titles
//   const renderHTML = (htmlString) => ({ __html: htmlString });

//   const pageTitle = categoryFromSlug ? categoryFromSlug.name : "All Products - porboi.in";
//   const pageDescription = categoryFromSlug 
//     ? `Browse all books in the ${categoryFromSlug.name} category.` 
//     : "Explore our complete collection of books and accessories.";

//   // Use the category image for the header, with a fallback
//   const headerImage = categoryFromSlug?.image?.src || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

//   return (
//     <>
//       <Head>
//         <title dangerouslySetInnerHTML={renderHTML(pageTitle)} />
//         <meta name="description" content={pageDescription} />
//         <meta name="keywords" content="bengali books, online bookstore, kolkata bookstore, indian literature" />
//       </Head>

//       {/* New Header Section */}
//       <div className="relative bg-gray-800 text-white py-24" style={{ backgroundImage: `url(${headerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
//         <div className="absolute inset-0 bg-black bg-opacity-60"></div>
//         <div className="relative container text-center z-10">
//           <h1 
//             className="text-4xl lg:text-5xl font-serif mb-4"
//             dangerouslySetInnerHTML={renderHTML(categoryFromSlug ? categoryFromSlug.name : 'Our Collection')}
//           />
//           <nav className="flex justify-center items-center text-sm text-gray-300">
//             <Link href="/" className="hover:text-white">Home</Link>
//             <ChevronRight className="w-4 h-4 mx-1" />
//             <Link href="/shop" className="hover:text-white">Shop</Link>
//             {categoryFromSlug && (
//               <>
//                 <ChevronRight className="w-4 h-4 mx-1" />
//                 <span className="text-white" dangerouslySetInnerHTML={renderHTML(categoryFromSlug.name)} />
//               </>
//             )}
//           </nav>
//         </div>
//       </div>

//       {/* Product Grid Section */}
//       <ProductGrid
//         key={categoryFromSlug ? categoryFromSlug.id : 'all-products'}
//         products={products}
//         categories={categories}
//         totalPages={totalPages}
//         currentPage={currentPage}
//         totalProducts={totalProducts}
//       />
//     </>
//   );
// };

// export async function getServerSideProps(context) {
//   const { query } = context;
//   const {
//     category_slug,
//     page = 1,
//     sortBy,
//     priceRange,
//     inStock,
//     onSale,
//   } = query;
  
//   let categoryFromSlug = null;
//   let categoriesForFilter = [];
//   const productsPerPage = 12;

//   try {
//     const allCategories = await api.getCategories({ per_page: 100, orderby: 'name', order: 'asc' }) || [];

//     const productParams = {
//       per_page: productsPerPage,
//       page: parseInt(page, 10),
//     };

//     // Handle all filters by adding them to the API request params
//     if (category_slug) {
//       categoryFromSlug = allCategories.find(c => c.slug === category_slug) || null;
//       if (categoryFromSlug) {
//         productParams.category = categoryFromSlug.id;
//         const subCategories = allCategories.filter(c => c.parent === categoryFromSlug.id && c.count > 0);
//         categoriesForFilter = [categoryFromSlug, ...subCategories];
//       }
//     } else {
//       categoriesForFilter = allCategories.filter(c => c.parent === 0 && c.count > 0);
//     }
    
//     if (onSale === 'true') productParams.on_sale = true;
//     if (inStock === 'true') productParams.stock_status = 'instock';
//     if (priceRange) {
//       const [min, max] = priceRange.split('-');
//       productParams.min_price = min;
//       productParams.max_price = max;
//     }
    
//     if (sortBy) {
//         switch (sortBy) {
//             case 'price-asc':
//               productParams.orderby = 'price';
//               productParams.order = 'asc';
//               break;
//             case 'price-desc':
//               productParams.orderby = 'price';
//               productParams.order = 'desc';
//               break;
//             case 'name-asc':
//               productParams.orderby = 'title';
//               productParams.order = 'asc';
//               break;
//             case 'popularity':
//               productParams.orderby = 'popularity';
//               productParams.order = 'desc';
//               break;
//             default:
//               productParams.orderby = 'date';
//               productParams.order = 'desc';
//         }
//     }

//     const response = await wooCommerceApi.get('/products', { params: productParams });
//     const products = response.data;
//     const totalProducts = parseInt(response.headers['x-wp-total'], 10);
//     const totalPages = parseInt(response.headers['x-wp-totalpages'], 10);

//     return {
//       props: {
//         products,
//         categories: categoriesForFilter,
//         totalPages,
//         currentPage: parseInt(page, 10),
//         totalProducts,
//         categoryFromSlug,
//       },
//     };
//   } catch (error) {
//     console.error('Error fetching shop data:', error.message);
//     return {
//       props: { products: [], categories: [], totalPages: 1, currentPage: 1, totalProducts: 0, categoryFromSlug: null },
//     };
//   }
// }

// export default ShopPage;


// pages/shop/index.js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import ProductGrid from '../../components/shop/ProductGrid';
import { api, wooCommerceApi } from '../../lib/api';
import { Book, ChevronRight } from 'lucide-react';

const ShopPage = ({ products, categories, totalPages, currentPage, categoryFromSlug, totalProducts }) => {
  const renderHTML = (htmlString) => ({ __html: htmlString });

  const pageTitle = categoryFromSlug ? categoryFromSlug.name : "All Products - porboi.in";
  const pageDescription = categoryFromSlug 
    ? `Browse all books in the ${categoryFromSlug.name} category.` 
    : "Explore our complete collection of books and accessories.";

  const headerImage = categoryFromSlug?.image?.src || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  return (
    <>
      <Head>
        <title dangerouslySetInnerHTML={renderHTML(pageTitle)} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="bengali books, online bookstore, kolkata bookstore, indian literature" />
      </Head>

      <div className="relative bg-gray-800 text-white py-24" style={{ backgroundImage: `url(${headerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative container text-center z-10">
          <h1 
            className="text-4xl lg:text-5xl font-serif mb-4"
            dangerouslySetInnerHTML={renderHTML(categoryFromSlug ? categoryFromSlug.name : 'Our Collection')}
          />
          <nav className="flex justify-center items-center text-sm text-gray-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4 mx-1" />
            <Link href="/shop" className="hover:text-white">Shop</Link>
            {categoryFromSlug && (
              <>
                <ChevronRight className="w-4 h-4 mx-1" />
                <span className="text-white" dangerouslySetInnerHTML={renderHTML(categoryFromSlug.name)} />
              </>
            )}
          </nav>
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

  const authorTermSlug = query.author;
  const publisherTermSlug = query.publisher;
  
  let categoryFromSlug = null;
  let categoriesForFilter = [];
  const productsPerPage = 12;

  try {
    const allCategories = await api.getCategories({ per_page: 100, orderby: 'name', order: 'asc' }) || [];
    const attributes = await api.getAttributes();

    const productParams = {
      per_page: productsPerPage,
      page: parseInt(page, 10),
    };

    if (authorTermSlug) {
        const authorAttr = attributes.find(attr => attr.slug === 'pa_book-author');
        if (authorAttr) {
            const terms = await api.getAttributeTerms(authorAttr.id, { slug: authorTermSlug });
            if (terms.length > 0) {
                productParams.attribute = 'pa_book-author';
                productParams.attribute_term = terms[0].id;
            }
        }
    }

    if (publisherTermSlug) {
        const publisherAttr = attributes.find(attr => attr.slug === 'pa_publisher');
        if (publisherAttr) {
            const terms = await api.getAttributeTerms(publisherAttr.id, { slug: publisherTermSlug });
            if (terms.length > 0) {
                productParams.attribute = 'pa_publisher';
                productParams.attribute_term = terms[0].id;
            }
        }
    }

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