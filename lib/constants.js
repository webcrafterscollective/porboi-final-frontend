// lib/constants.js
export const SITE_CONFIG = {
  name: "ChapterOne",
  description: "The all-time classics bookstore",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com",
  logo: "/images/logo.png",
  favicon: "/favicon.ico",
  defaultImage: "/images/og-image.jpg",
  social: {
    twitter: "@chapterone",
    facebook: "chapterone",
    instagram: "chapterone"
  }
};

export const PRODUCT_CONFIG = {
  itemsPerPage: 12,
  maxRelatedProducts: 4,
  freeShippingThreshold: 50,
  taxRate: 0.08,
  standardShipping: 10,
  expressShipping: 20
};

export const CATEGORIES = {
  BESTSELLERS: "Best Sellers",
  FANTASY: "Fantasy",
  HISTORY: "History", 
  ART: "Art",
  LOVE_STORIES: "Love Stories"
};

export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled"
};