// components/common/Header.js - Updated with a sticky top navigation bar
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
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

  useEffect(() => {
    if (isAuthenticated) {
      updateCartInfo();
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
    { name: 'Books', href: '/shop', hasDropdown: false },
    { name: 'Authors', href: '/authors', hasDropdown: false },
    { name: 'Publishers', href: '/publishers', hasDropdown: false },
    { name: 'Self Publication', href: '/self-publication', hasDropdown: false },
    { name: 'Event', href: '/event', hasDropdown: false },
    { name: 'Fashion', href: '/fashion', hasDropdown: false },
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
      <header className="bg-white shadow-md sticky top-0 left-0 right-0 z-50 border-b border-gray-200">
        {/* Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <img src="/logo.svg" alt="porboi.in logo" className="h-16 w-auto" />
                </Link>

                {/* Left-aligned Navigation */}
                <nav className="hidden lg:flex space-x-8">
                    {navigation.map((item) => (
                        <Link key={item.name} href={item.href} className={`flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive(item.href) ? 'text-red-600' : 'text-gray-700 hover:text-red-600'}`}>
                        <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Right Side: Actions */}
                <div className="flex items-center space-x-4">
                    {/* Cart */}
                    <Link href="/cart" onClick={handleCartClick} className="relative p-2 text-gray-700 hover:text-red-600 transition-colors">
                        <ShoppingCart className="w-6 h-6" />
                        {isAuthenticated && cartCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {cartCount}
                        </span>
                        )}
                    </Link>

                    {/* User Menu */}
                    {isAuthenticated ? (
                    <div className="relative">
                        <button onClick={() => setShowUserMenu(!showUserMenu)} className="p-2 text-gray-700 hover:text-red-600 transition-colors">
                        <User className="w-6 h-6" />
                        </button>
                        {showUserMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                            <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>My Account</Link>
                            <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowUserMenu(false)}>Order History</Link>
                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><LogOut className="w-4 h-4 inline mr-2" />Sign Out</button>
                            </div>
                        )}
                    </div>
                    ) : (
                    <button onClick={() => setShowLoginModal(true)} className="hidden lg:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors">
                        <User className="w-4 h-4" />
                        <span>Sign In</span>
                    </button>
                    )}
                </div>

                 {/* Mobile Menu Button */}
                 <div className="lg:hidden">
                    <button className="p-2 text-gray-700 hover:text-red-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                 </div>
            </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-200">
                <nav className="flex flex-col space-y-2 p-4">
                  {navigation.map((item) => (
                      <Link key={item.name} href={item.href} className={`px-3 py-2 text-base font-medium rounded-md ${isActive(item.href) ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setIsMenuOpen(false)}>
                          {item.name}
                      </Link>
                  ))}
                  {!isAuthenticated && (
                      <div className="pt-4 border-t border-gray-200">
                        <button onClick={() => { setShowLoginModal(true); setIsMenuOpen(false); }} className="w-full text-left text-base font-medium text-red-600">
                            Sign In
                        </button>
                      </div>
                  )}
                </nav>
            </div>
        )}
      </header>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSwitchToSignup={switchToSignup} />
      <SignupModal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)} onSwitchToLogin={switchToLogin} />
    </>
  );
};

export default Header;
