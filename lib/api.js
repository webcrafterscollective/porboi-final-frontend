// // lib/api.js - WooCommerce API Configuration
// import axios from 'axios';
// import https from 'https'; // Import the https module

// const API_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
// const CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
// const CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

// // Create an https agent to allow self-signed certificates
// // This is the key change to fix the deployment error
// const httpsAgent = new https.Agent({
//   rejectUnauthorized: false,
// });

// // Create axios instance for WooCommerce API
// export const wooCommerceApi = axios.create({
//   baseURL: `${API_BASE_URL}/wp-json/wc/v3`,
//   auth: {
//     username: CONSUMER_KEY,
//     password: CONSUMER_SECRET,
//   },
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   httpsAgent, // Apply the custom https agent
// });

// // Create axios instance for WordPress REST API
// export const wordpressApi = axios.create({
//   baseURL: `${API_BASE_URL}/wp-json/wp/v2`,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   httpsAgent, // Apply the custom https agent here as well
// });

// // API Functions for WooCommerce
// export const api = {
//   // Products
//   getProducts: async (params = {}) => {
//     try {
//       const response = await wooCommerceApi.get('/products', { params });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       throw error;
//     }
//   },

//   getProduct: async (id) => {
//     try {
//       const response = await wooCommerceApi.get(`/products/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching product:', error);
//       throw error;
//     }
//   },

//   // Categories
//   getCategories: async (params = {}) => {
//     try {
//       const response = await wooCommerceApi.get('/products/categories', { params });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       throw error;
//     }
//   },

//   getCategoryBySlug: async (slug) => {
//     try {
//       const response = await wooCommerceApi.get('/products/categories', {
//         params: { slug },
//       });
//       if (response.data && response.data.length > 0) {
//         return response.data[0];
//       }
//       return null;
//     } catch (error) {
//       console.error(`Error fetching category by slug ${slug}:`, error);
//       throw error;
//     }
//   },

//   getProductBySlug: async (slug) => {
//     try {
//       const response = await wooCommerceApi.get('/products', {
//         params: { slug },
//       });
//       if (response.data && response.data.length > 0) {
//         return response.data[0];
//       }
//       return null;
//     } catch (error) {
//       console.error(`Error fetching product by slug ${slug}:`, error);
//       throw error;
//     }
//   },

//   getRelatedProducts: async (productId) => {
//       try {
//         const product = await api.getProduct(productId);
//         const relatedIds = product.related_ids;
//         if (!relatedIds || relatedIds.length === 0) {
//             return [];
//         }
//         const response = await wooCommerceApi.get('/products', {
//             params: { include: relatedIds.join(',') },
//         });
//         return response.data;
//       } catch (error) {
//           console.error(`Error fetching related products for ID ${productId}:`, error);
//           return [];
//       }
//   },

//   // Orders
//   createOrder: async (orderData) => {
//     try {
//       const response = await wooCommerceApi.post('/orders', orderData);
//       return response.data;
//     } catch (error) {
//       console.error('Error creating order:', error);
//       throw error;
//     }
//   },

//    getAllProductSlugs: async () => {
//     try {
//       const response = await wooCommerceApi.get('/products', {
//         params: { per_page: 100 },
//       });

//       return response.data.map((product) => ({
//         slug: product.slug,
//       }));
//     } catch (error) {
//       console.error('Error fetching product slugs:', error);
//       throw error;
//     }
//   },

//   getOrders: async () => {
//     try {
//       const response = await wooCommerceApi.get('/orders');
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       throw error;
//     }
//   },
// };

// lib/api.js - WooCommerce API Configuration
import axios from 'axios';
import https from 'https'; // Import the https module

const API_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
const CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

// Create an https agent to allow self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Create axios instance for WooCommerce API
export const wooCommerceApi = axios.create({
  baseURL: `${API_BASE_URL}/wp-json/wc/v3`,
  auth: {
    username: CONSUMER_KEY,
    password: CONSUMER_SECRET,
  },
  headers: {
    'Content-Type': 'application/json',
  },
  httpsAgent,
});

// Create axios instance for WordPress REST API
export const wordpressApi = axios.create({
  baseURL: `${API_BASE_URL}/wp-json/wp/v2`,
  headers: {
    'Content-Type': 'application/json',
  },
  httpsAgent,
});

// API Functions for WooCommerce
export const api = {
  // Products
  getProducts: async (params = {}) => {
    try {
      const response = await wooCommerceApi.get('/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProduct: async (id) => {
    try {
      const response = await wooCommerceApi.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Categories
  getCategories: async (params = {}) => {
    try {
      const response = await wooCommerceApi.get('/products/categories', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getCategoryBySlug: async (slug) => {
    try {
      const response = await wooCommerceApi.get('/products/categories', {
        params: { slug },
      });
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      console.error(`Error fetching category by slug ${slug}:`, error);
      throw error;
    }
  },

  getProductBySlug: async (slug) => {
    try {
      const response = await wooCommerceApi.get('/products', {
        params: { slug },
      });
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      console.error(`Error fetching product by slug ${slug}:`, error);
      throw error;
    }
  },

  getRelatedProducts: async (productId) => {
      try {
        const product = await api.getProduct(productId);
        const relatedIds = product.related_ids;
        if (!relatedIds || relatedIds.length === 0) {
            return [];
        }
        const response = await wooCommerceApi.get('/products', {
            params: { include: relatedIds.join(',') },
        });
        return response.data;
      } catch (error) {
          console.error(`Error fetching related products for ID ${productId}:`, error);
          return [];
      }
  },

  // Orders
  createOrder: async (orderData) => {
    try {
      const response = await wooCommerceApi.post('/orders', orderData);
      return response.data;
    } catch (error)
      {
      console.error('Error creating order:', error);
      throw error;
    }
  },

   getAllProductSlugs: async () => {
    try {
      const response = await wooCommerceApi.get('/products', {
        params: { per_page: 100 },
      });

      return response.data.map((product) => ({
        slug: product.slug,
      }));
    } catch (error) {
      console.error('Error fetching product slugs:', error);
      throw error;
    }
  },

  getOrders: async () => {
    try {
      const response = await wooCommerceApi.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // **FIX: Added function to get a single order by ID**
  getOrder: async (id) => {
    try {
      const response = await wooCommerceApi.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },
};
