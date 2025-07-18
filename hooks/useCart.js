// hooks/useCart.js - Custom Cart Hook
import { useState, useEffect } from 'react';
import { cartUtils } from '../utils/cartUtils';

export const useCart = () => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart on mount
    const currentCart = cartUtils.getCart();
    setCart(currentCart);
    setIsLoading(false);

    // Listen for cart updates
    const handleCartUpdate = () => {
      const updatedCart = cartUtils.getCart();
      setCart(updatedCart);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const addToCart = (product, quantity = 1) => {
    const updatedCart = cartUtils.addToCart(product, quantity);
    setCart(updatedCart);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    return updatedCart;
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartUtils.removeFromCart(productId);
    setCart(updatedCart);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    return updatedCart;
  };

  const updateQuantity = (productId, quantity) => {
    const updatedCart = cartUtils.updateQuantity(productId, quantity);
    setCart(updatedCart);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    return updatedCart;
  };

  const clearCart = () => {
    const clearedCart = cartUtils.clearCart();
    setCart(clearedCart);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    return clearedCart;
  };

  const getCartTotal = () => cartUtils.getCartTotal();
  const getCartItemCount = () => cartUtils.getCartItemCount();

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount
  };
};