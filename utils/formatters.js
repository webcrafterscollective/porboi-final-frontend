// utils/formatters.js
export const formatPrice = (price, currency = 'INR') => {
  // Ensure price is a number before formatting
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    return ''; // Return empty string or a default value for invalid prices
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(numericPrice);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatShortDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const generateSKU = (name, id) => {
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return `${cleanName.substring(0, 3)}${id.toString().padStart(4, '0')}`;
};
