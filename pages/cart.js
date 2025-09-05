// // pages/cart.js - Updated with Protected Route
// import React, { useState, useEffect } from 'react';
// import Head from 'next/head';
// import Link from 'next/link';
// import { ShoppingBag } from 'lucide-react';
// import CartItem from '../components/cart/CartItem';
// import CartSummary from '../components/cart/CartSummary';
// import ProtectedRoute from '../components/common/ProtectedRoute';
// import { cartUtils } from '../utils/cartUtils';

// const CartPage = () => {
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Load cart on component mount
//     const currentCart = cartUtils.getCart();
//     setCart(currentCart);
//     setLoading(false);
//   }, []);

//   const handleCartUpdate = (updatedCart) => {
//     setCart(updatedCart);
//   };

//   const handleClearCart = () => {
//     const clearedCart = cartUtils.clearCart();
//     setCart(clearedCart);
//     window.dispatchEvent(new CustomEvent('cartUpdated'));
//   };

//   if (loading) {
//     return (
//       <div className="container section-padding">
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
//           <div className="space-y-4">
//             {[1, 2, 3].map(i => (
//               <div key={i} className="h-24 bg-gray-200 rounded"></div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <ProtectedRoute>
//       <Head>
//         <title>Shopping Cart - ChapterOne Bookstore</title>
//         <meta name="description" content="Review and manage your cart items before checkout at ChapterOne bookstore." />
//       </Head>

//       <div className="bg-gray-50 min-h-screen">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           {/* Page Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-serif text-gray-900 mb-2">Shopping Cart</h1>
//             <nav className="text-sm">
//               <Link href="/" className="text-gray-600 hover:text-red-600">Home</Link>
//               <span className="text-gray-400 mx-2">/</span>
//               <span className="text-gray-900">Cart</span>
//             </nav>
//           </div>

//           {cart.length === 0 ? (
//             /* Empty Cart */
//             <div className="text-center py-16">
//               <div className="mb-6">
//                 <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto" />
//               </div>
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//                 Your cart is empty
//               </h2>
//               <p className="text-gray-600 mb-8 max-w-md mx-auto">
//                 Looks like you haven't added any books to your cart yet. Start browsing our collection!
//               </p>
//               <Link href="/shop">
//                 <button className="btn-primary">
//                   Start Shopping
//                 </button>
//               </Link>
//             </div>
//           ) : (
//             /* Cart with Items */
//             <div className="flex flex-col lg:flex-row gap-8">
//               {/* Cart Items */}
//               <div className="w-full lg:w-2/3 bg-white rounded-lg p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-xl font-semibold text-gray-900">
//                     Cart Items ({cart.length})
//                   </h2>
//                   <button
//                     onClick={handleClearCart}
//                     className="text-red-600 hover:text-red-700 text-sm"
//                   >
//                     Clear Cart
//                   </button>
//                 </div>

//                 <div className="divide-y divide-gray-200">
//                   {cart.map((item) => (
//                     <CartItem
//                       key={item.id}
//                       item={item}
//                       onUpdate={handleCartUpdate}
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Cart Summary */}
//               <div className="w-full lg:w-1/3">
//                 <CartSummary cart={cart} />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default CartPage;


// pages/cart.js - Updated with Protected Route
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { cartUtils } from '../utils/cartUtils';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart on component mount
    const currentCart = cartUtils.getCart();
    setCart(currentCart);
    setLoading(false);
  }, []);

  const handleCartUpdate = (updatedCart) => {
    setCart(updatedCart);
  };

  const handleClearCart = () => {
    const clearedCart = cartUtils.clearCart();
    setCart(clearedCart);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  if (loading) {
    return (
      <div className="container section-padding">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Shopping Cart - ChapterOne Bookstore</title>
        <meta name="description" content="Review and manage your cart items before checkout at ChapterOne bookstore." />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif text-gray-900 mb-2">Shopping Cart</h1>
            <nav className="text-sm">
              <Link href="/" className="text-gray-600 hover:text-red-600">Home</Link>
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-900">Cart</span>
            </nav>
          </div>

          {cart.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <div className="mb-6">
                <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any books to your cart yet. Start browsing our collection!
              </p>
              <Link href="/shop">
                <button className="btn-primary">
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            /* Cart with Items */
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="w-full lg:w-2/3 bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Cart Items ({cart.length})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdate={handleCartUpdate}
                    />
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="w-full lg:w-1/3">
                <CartSummary cart={cart} />
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CartPage;