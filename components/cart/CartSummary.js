// components/cart/CartSummary.js
import React from 'react';
import Link from 'next/link';

const CartSummary = ({ cart, onCheckout }) => {
  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-gray-50 rounded-lg p-6 h-fit">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600 font-medium">FREE</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-semibold text-gray-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Notice */}
      {subtotal < 50 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <p className="text-sm text-blue-800">
            Add <span className="font-semibold">${(50 - subtotal).toFixed(2)}</span> more for free shipping!
          </p>
        </div>
      )}

      {/* Checkout Button */}
      <Link href="/checkout">
        <button 
          className="w-full btn-primary mb-3"
          onClick={onCheckout}
        >
          Proceed to Checkout
        </button>
      </Link>

      {/* Continue Shopping */}
      <Link href="/shop">
        <button className="w-full btn-secondary text-center">
          Continue Shopping
        </button>
      </Link>

      {/* Security Badge */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure Checkout
        </div>
      </div>
    </div>
  );
};

export default CartSummary;