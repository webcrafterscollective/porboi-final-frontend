// utils/cartUtils.js - Local Cart Management (fallback)
import Cookies from 'js-cookie';

export const cartUtils = {
  getCart: () => {
    const cart = Cookies.get('cart');
    return cart ? JSON.parse(cart) : [];
  },

  addToCart: (product, quantity = 1) => {
    const cart = cartUtils.getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.src || '',
        quantity: quantity,
      });
    }
    
    Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
    return cart;
  },

  updateQuantity: (productId, quantity) => {
    const cart = cartUtils.getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      if (quantity <= 0) {
        return cartUtils.removeFromCart(productId);
      }
      item.quantity = quantity;
      Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
    }
    
    return cart;
  },

  removeFromCart: (productId) => {
    const cart = cartUtils.getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    Cookies.set('cart', JSON.stringify(updatedCart), { expires: 7 });
    return updatedCart;
  },

  clearCart: () => {
    Cookies.remove('cart');
    return [];
  },

  getCartTotal: () => {
    const cart = cartUtils.getCart();
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  },

  getCartItemCount: () => {
    const cart = cartUtils.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },

  
};