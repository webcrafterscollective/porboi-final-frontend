// components/common/ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  fallback = null,
  showMessage = true,
  redirectTo = null 
}) => {
  const { isAuthenticated, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      if (redirectTo) {
        // If redirectTo is specified, redirect instead of showing modal
        window.location.href = redirectTo;
      } else {
        // Show login modal
        setShowLoginModal(true);
      }
    }
  }, [loading, isAuthenticated, redirectTo]);

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    
    // If user closes modal without logging in, redirect to home
    if (!isAuthenticated) {
      window.location.href = '/';
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Checking authentication..." />
      </div>
    );
  }

  // If not authenticated, show fallback or authentication prompt
  if (!isAuthenticated) {
    return (
      <>
        {/* Custom fallback or default authentication prompt */}
        {fallback || (showMessage && (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
              <div className="mb-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-serif text-gray-900 mb-4">
                Authentication Required
              </h2>
              <p className="text-gray-600 mb-6">
                Please sign in to access this page and manage your cart.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="w-full btn-primary"
                >
                  Sign In
                </button>
                
                <button
                  onClick={() => setShowSignupModal(true)}
                  className="w-full btn-secondary"
                >
                  Create Account
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full text-gray-600 hover:text-gray-800 py-2"
                >
                  Return to Homepage
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Authentication Modals */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleModalClose}
          onSwitchToSignup={switchToSignup}
        />
        
        <SignupModal
          isOpen={showSignupModal}
          onClose={handleModalClose}
          onSwitchToLogin={switchToLogin}
        />
      </>
    );
  }

  // User is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;