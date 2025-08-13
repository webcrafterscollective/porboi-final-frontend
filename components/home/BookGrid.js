// components/home/BookGrid.js
import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import ProductCard from '../shop/ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

const BookGrid = () => {
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMainCategory, setActiveMainCategory] = useState('All');
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  // Define the main categories you want to display
  const mainCategoryNames = ['Books', 'Text Books', 'Old Books', 'Accessories'];

  // 1. Fetch all categories on mount to map names to IDs
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const allCategories = await api.getCategories({ per_page: 100 });
        const filteredMain = allCategories.filter(cat => mainCategoryNames.includes(cat.name));
        setMainCategories(filteredMain);
      } catch (error) {
        console.error("Failed to fetch main categories:", error);
      }
    };
    fetchMainCategories();
  }, []);

  // 2. Fetch subcategories when a main category is selected
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (activeMainCategory === 'All' || activeMainCategory === 'Accessories') {
        setSubCategories([]);
        setActiveSubCategory(null);
        return;
      }
      
      const parentCategory = mainCategories.find(cat => cat.name === activeMainCategory);
      if (parentCategory) {
        setLoading(true);
        try {
          const fetchedSubCategories = await api.getCategories({ parent: parentCategory.id });
          setSubCategories(fetchedSubCategories);
          // Automatically select the first subcategory if available
          if (fetchedSubCategories.length > 0) {
            setActiveSubCategory(fetchedSubCategories[0].id);
          } else {
            setActiveSubCategory(null);
          }
        } catch (error) {
          console.error(`Failed to fetch subcategories for ${activeMainCategory}:`, error);
          setSubCategories([]);
          setActiveSubCategory(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSubCategories();
  }, [activeMainCategory, mainCategories]);

  // 3. Fetch products when category/subcategory changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { per_page: 10 };
        
        let categoryIdToFetch;

        if (activeSubCategory) {
          categoryIdToFetch = activeSubCategory;
        } else if (activeMainCategory !== 'All') {
          const parentCategory = mainCategories.find(cat => cat.name === activeMainCategory);
          if (parentCategory) {
            categoryIdToFetch = parentCategory.id;
          }
        }

        if (categoryIdToFetch) {
          params.category = categoryIdToFetch;
        }
        
        const productsData = await api.getProducts(params);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // Clear products on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeMainCategory, activeSubCategory, mainCategories]);
  
  const handleMainCategoryClick = (categoryName) => {
    setActiveMainCategory(categoryName);
    setActiveSubCategory(null); 
  };

  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        {/* Main Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap justify-center gap-4 bg-white p-2 rounded-lg shadow">
            <button
              onClick={() => handleMainCategoryClick('All')}
              className={`category-filter ${activeMainCategory === 'All' ? 'active' : ''}`}
            >
              All
            </button>
            {mainCategoryNames.map((category) => (
              <button
                key={category}
                onClick={() => handleMainCategoryClick(category)}
                className={`category-filter ${activeMainCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
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
                  onClick={() => setActiveSubCategory(subCat.id)}
                  className={`px-4 py-2 text-sm rounded-full transition-colors duration-200 ${
                    activeSubCategory === subCat.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {subCat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid - Responsive */}
        {loading ? (
          <LoadingSpinner size="large" text="Fetching books..." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
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
