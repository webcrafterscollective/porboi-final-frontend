// // components/home/BookGrid.js
// import React, { useState, useEffect } from 'react';
// import { api } from '../../lib/api';
// import ProductCard from '../shop/ProductCard';
// import LoadingSpinner from '../common/LoadingSpinner';

// const BookGrid = () => {
//   const [mainCategories, setMainCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeMainCategory, setActiveMainCategory] = useState('All');
//   const [activeSubCategory, setActiveSubCategory] = useState(null);

//   // Define the main categories you want to display
//   const mainCategoryNames = ['Books', 'Text Books', 'Old Books', 'Accessories'];

//   // 1. Fetch all categories on mount to map names to IDs
//   useEffect(() => {
//     const fetchMainCategories = async () => {
//       try {
//         const allCategories = await api.getCategories({ per_page: 100 });
//         const filteredMain = allCategories.filter(cat => mainCategoryNames.includes(cat.name));
//         setMainCategories(filteredMain);
//       } catch (error) {
//         console.error("Failed to fetch main categories:", error);
//       }
//     };
//     fetchMainCategories();
//   }, []);

//   // 2. Fetch subcategories when a main category is selected
//   useEffect(() => {
//     const fetchSubCategories = async () => {
//       if (activeMainCategory === 'All' || activeMainCategory === 'Accessories') {
//         setSubCategories([]);
//         setActiveSubCategory(null);
//         return;
//       }
      
//       const parentCategory = mainCategories.find(cat => cat.name === activeMainCategory);
//       if (parentCategory) {
//         setLoading(true);
//         try {
//           const fetchedSubCategories = await api.getCategories({ parent: parentCategory.id });
//           setSubCategories(fetchedSubCategories);
//           // Automatically select the first subcategory if available
//           if (fetchedSubCategories.length > 0) {
//             setActiveSubCategory(fetchedSubCategories[0].id);
//           } else {
//             setActiveSubCategory(null);
//           }
//         } catch (error) {
//           console.error(`Failed to fetch subcategories for ${activeMainCategory}:`, error);
//           setSubCategories([]);
//           setActiveSubCategory(null);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };

//     fetchSubCategories();
//   }, [activeMainCategory, mainCategories]);

//   // 3. Fetch products when category/subcategory changes
//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const params = { per_page: 10 };
        
//         let categoryIdToFetch;

//         if (activeSubCategory) {
//           categoryIdToFetch = activeSubCategory;
//         } else if (activeMainCategory !== 'All') {
//           const parentCategory = mainCategories.find(cat => cat.name === activeMainCategory);
//           if (parentCategory) {
//             categoryIdToFetch = parentCategory.id;
//           }
//         }

//         if (categoryIdToFetch) {
//           params.category = categoryIdToFetch;
//         }
        
//         const productsData = await api.getProducts(params);
//         setProducts(productsData);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         setProducts([]); // Clear products on error
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [activeMainCategory, activeSubCategory, mainCategories]);
  
//   const handleMainCategoryClick = (categoryName) => {
//     setActiveMainCategory(categoryName);
//     setActiveSubCategory(null);
//   };

//   return (
//     <section className="section-padding bg-gray-50">
//       <div className="container">
//         {/* Main Category Filter */}
//         <div className="flex justify-center mb-8">
//           <div className="flex flex-wrap justify-center gap-4 bg-white p-2 rounded-lg shadow">
//             <button
//               onClick={() => handleMainCategoryClick('All')}
//               className={`category-filter ${activeMainCategory === 'All' ? 'active' : ''}`}
//             >
//               All
//             </button>
//             {mainCategoryNames.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => handleMainCategoryClick(category)}
//                 className={`category-filter ${activeMainCategory === category ? 'active' : ''}`}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Sub Category Filter */}
//         {subCategories.length > 0 && (
//           <div className="flex justify-center mb-12 animate-fade-in">
//             <div className="flex flex-wrap justify-center gap-3">
//               {subCategories.map((subCat) => (
//                 <button
//                   key={subCat.id}
//                   onClick={() => setActiveSubCategory(subCat.id)}
//                   className={`px-4 py-2 text-sm rounded-full transition-colors duration-200 ${
//                     activeSubCategory === subCat.id
//                       ? 'bg-red-600 text-white'
//                       : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                   }`}
//                 >
//                   {subCat.name}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Products Grid - Responsive */}
//         {loading ? (
//           <LoadingSpinner size="large" text="Fetching books..." />
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8"> {/* UPDATED */}
//             {products.length > 0 ? (
//               products.map((product) => (
//                 <ProductCard key={product.id} product={product} />
//               ))
//             ) : (
//               <div className="col-span-full text-center py-10">
//                 <p className="text-gray-600">No books found in this category. Try another selection!</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default BookGrid;

// components/home/BookGrid.js
import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import ProductCard from '../shop/ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

const BookGrid = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [topLevelCategories, setTopLevelCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMainCategory, setActiveMainCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [categoryToFetch, setCategoryToFetch] = useState(null);

  // 1. Fetch all categories on mount and set initial state
  useEffect(() => {
    const fetchAndSetCategories = async () => {
      setLoading(true);
      try {
        const categories = await api.getCategories({ per_page: 100 });
        const validCategories = categories.filter(cat => cat.slug !== 'uncategorized' && cat.count > 0);
        setAllCategories(validCategories);

        const topLevel = validCategories.filter(cat => cat.parent === 0);
        setTopLevelCategories(topLevel);

        if (topLevel.length > 0) {
          setActiveMainCategory(topLevel[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndSetCategories();
  }, []);

  // 2. Determine which category to fetch products from whenever the active categories change
  useEffect(() => {
    if (activeMainCategory === null) return;

    const children = allCategories.filter(cat => cat.parent === activeMainCategory);
    setSubCategories(children);

    // If a subcategory is active, fetch for it.
    // Otherwise, if there are subcategories, fetch for the first one by default.
    // Otherwise, fetch for the main category.
    if (activeSubCategory && children.some(c => c.id === activeSubCategory)) {
      setCategoryToFetch(activeSubCategory);
    } else if (children.length > 0) {
      const firstSubCategoryId = children[0].id;
      setActiveSubCategory(firstSubCategoryId);
      setCategoryToFetch(firstSubCategoryId);
    } else {
      setCategoryToFetch(activeMainCategory);
    }
  }, [activeMainCategory, activeSubCategory, allCategories]);

  // 3. Fetch products only when the definitive categoryToFetch is set
  useEffect(() => {
    const fetchProducts = async () => {
      if (categoryToFetch === null) {
        setProducts([]);
        return;
      }
      setLoading(true);
      try {
        const params = { per_page: 10, category: categoryToFetch };
        const productsData = await api.getProducts(params);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryToFetch]);

  // When a main category is clicked, reset the active subcategory
  const handleMainCategoryClick = (categoryId) => {
    setActiveMainCategory(categoryId);
    setActiveSubCategory(null); // Reset subcategory to allow the effect to pick the default
  };
  
  // When a subcategory is clicked, update it directly
  const handleSubCategoryClick = (categoryId) => {
    setActiveSubCategory(categoryId);
  };

  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        {/* Main Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap justify-center gap-4 bg-white p-2 rounded-lg shadow">
            {topLevelCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleMainCategoryClick(category.id)}
                className={`category-filter ${activeMainCategory === category.id ? 'active' : ''}`}
                dangerouslySetInnerHTML={{ __html: category.name }}
              />
            ))}
          </div>
        </div>

        {/* Sub Category Filter */}
        {subCategories.length > 0 && (
          <div className="flex justify-center mb-12 animate-fade-in">
            <div className="flex flex-wrap justify-center gap-3">
              {subCategories.map((subCat) => (
                <button
                  key={subCat.id}
                  onClick={() => handleSubCategoryClick(subCat.id)}
                  className={`px-4 py-2 text-sm rounded-full transition-colors duration-200 ${
                    activeSubCategory === subCat.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  dangerouslySetInnerHTML={{ __html: subCat.name }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <LoadingSpinner size="large" text="Fetching books..." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-600">No books found in this category. Try another selection!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookGrid;