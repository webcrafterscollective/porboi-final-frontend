// utils/analytics.js
export const analytics = {
  // Google Analytics 4 events
  trackEvent: (eventName, parameters = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  },

  trackPurchase: (transactionId, value, currency = 'USD', items = []) => {
    analytics.trackEvent('purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items
    });
  },

  trackAddToCart: (currency, value, items) => {
    analytics.trackEvent('add_to_cart', {
      currency: currency,
      value: value,
      items: items
    });
  },

  trackViewItem: (currency, value, items) => {
    analytics.trackEvent('view_item', {
      currency: currency,
      value: value,
      items: items
    });
  },

  trackSearch: (searchTerm) => {
    analytics.trackEvent('search', {
      search_term: searchTerm
    });
  }
};