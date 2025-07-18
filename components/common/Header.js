// components/common/Header.js - Updated with Authentication
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { cartUtils } from '../../utils/cartUtils';
import { useAuth } from '../../hooks/useAuth';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  // Update cart count on component mount and when cart changes
  useEffect(() => {
    if (isAuthenticated) {
      updateCartInfo();
      
      // Listen for cart updates
      const handleCartUpdate = () => updateCartInfo();
      window.addEventListener('cartUpdated', handleCartUpdate);
      
      return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }
  }, [isAuthenticated]);

  const updateCartInfo = () => {
    setCartCount(cartUtils.getCartItemCount());
    setCartTotal(cartUtils.getCartTotal());
  };

  const navigation = [
    { name: 'Home', href: '/', hasDropdown: true },
    { name: 'Pages', href: '/pages', hasDropdown: true },
    { name: 'Events', href: '/events', hasDropdown: true },
    { name: 'Blog', href: '/blog', hasDropdown: true },
    { name: 'Shop', href: '/shop', hasDropdown: true },
  ];

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  const handleCartClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowLoginModal(true);
      return;
    }
    // Proceed to cart
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-gray-800 text-white text-center py-2 text-sm">
          FREE SHIPPING FOR ORDERS OVER $50
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                <span className="text-gray-800 font-bold">📖</span>
              </div>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-red-600'
                        : 'text-gray-700 hover:text-red-600'
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.hasDropdown && (
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Right Side - Search, Cart, User, Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button className="p-2 text-gray-700 hover:text-red-600 transition-colors">
                <Search className="w-6 h-6" />
              </button>

              {/* Cart */}
              <Link href="/cart" onClick={handleCartClick} className="relative p-2 text-gray-700 hover:text-red-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {isAuthenticated && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                {isAuthenticated && (
                  <span className="hidden lg:block text-sm ml-2">${cartTotal.toFixed(2)}</span>
                )}
                {!isAuthenticated && (
                  <span className="hidden lg:block text-sm ml-2">Login</span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <User className="w-6 h-6" />
                    <span className="hidden lg:block text-sm">{user?.displayName || user?.username}</span>
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Order History
                      </Link>
                      <Link
                        href="/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Wishlist
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 inline mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="hidden lg:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-gray-700 hover:text-red-600 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 text-base font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-red-600'
                        : 'text-gray-700 hover:text-red-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Auth */}
                {!isAuthenticated && (
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-base font-medium text-red-600"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Authentication Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={switchToSignup}
      />
      
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
};

export default Header;