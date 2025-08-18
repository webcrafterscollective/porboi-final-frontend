// components/cart/CartItem.js
import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { cartUtils } from '../../utils/cartUtils';
import { toast } from 'react-hot-toast';

const CartItem = ({ item, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateQuantity = async (newQuantity) => {
    setIsUpdating(true);
    try {
      const updatedCart = cartUtils.updateQuantity(item.id, newQuantity);
      onUpdate(updatedCart);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const removeItem = async () => {
    setIsUpdating(true);
    try {
      const updatedCart = cartUtils.removeFromCart(item.id);
      onUpdate(updatedCart);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setIsUpdating(false);
    }
  };

  const itemTotal = (parseFloat(item.price) * item.quantity).toFixed(2);

  return (
    <div className={`flex items-center py-6 border-b border-gray-200 transition-opacity ${
      isUpdating ? 'opacity-50' : ''
    }`}>
      {/* Product Image */}
      <div className="w-24 h-32 flex-shrink-0 mr-6">
        <img
          src={item.image || '/images/placeholder-book.jpg'}
          alt={item.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Product Info */}
          <div className="flex-1 mb-4 lg:mb-0">
            <Link href={`/shop/${item.id}`}>
              <h3 className="text-lg font-medium text-gray-900 hover:text-red-600 transition-colors">
                {item.name}
              </h3>
            </Link>
            <p className="text-gray-600 mt-1">₹{parseFloat(item.price).toFixed(2)} each</p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center space-x-4">
            {/* Quantity */}
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => updateQuantity(item.quantity - 1)}
                disabled={isUpdating || item.quantity <= 1}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.quantity + 1)}
                disabled={isUpdating}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Item Total */}
            <div className="text-lg font-semibold text-gray-900 min-w-[4rem] text-right">
              ₹{itemTotal}
            </div>

            {/* Remove Button */}
            <button
              onClick={removeItem}
              disabled={isUpdating}
              className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove item"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
