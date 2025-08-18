// pages/account.js
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { User, ShoppingBag, MapPin, Lock, Search } from 'lucide-react';

const AccountPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: User },
    { id: 'orders', name: 'Order History', icon: ShoppingBag, href: '/orders' },
    { id: 'track', name: 'Track Order', icon: Search },
    { id: 'profile', name: 'Profile Details', icon: Lock },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome, {user?.displayName || 'User'}!</h2>
            <p className="text-gray-600">
              From your account dashboard, you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
            </p>
          </div>
        );
      case 'track':
        return <OrderTracking />;
      case 'profile':
        return <ProfileDetails user={user} />;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>My Account - porboi.in</title>
      </Head>
      <div className="bg-gray-50 min-h-screen">
        <div className="container section-padding">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif text-gray-900">My Account</h1>
          </div>
          <div className="max-w-5xl mx-auto md:grid md:grid-cols-4 md:gap-10">
            <nav className="md:col-span-1 mb-8 md:mb-0">
              <ul className="space-y-2">
                {tabs.map(tab => (
                  <li key={tab.id}>
                    {tab.href ? (
                      <Link href={tab.href} className="w-full flex items-center p-3 rounded-md text-left transition-colors hover:bg-gray-200">
                        <tab.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">{tab.name}</span>
                      </Link>
                    ) : (
                      <button 
                        onClick={() => setActiveTab(tab.id)} 
                        className={`w-full flex items-center p-3 rounded-md text-left transition-colors ${activeTab === tab.id ? 'bg-red-600 text-white' : 'hover:bg-gray-200'}`}
                      >
                        <tab.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">{tab.name}</span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="md:col-span-3">
              <div className="bg-white p-8 rounded-lg shadow-md">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

// Sub-component for Order Tracking
const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    // Mock API call
    setTimeout(() => {
      if (orderId === '12345') {
        setStatus({ id: '12345', stage: 'shipped', message: 'Your order is on its way!', location: 'Kolkata Hub' });
      } else if (orderId) {
        setStatus({ id: orderId, stage: 'processing', message: 'Your order is being processed.', location: 'Warehouse' });
      } else {
        setStatus({ error: true, message: 'Please enter a valid order ID.' });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Track Your Order</h2>
      <p className="text-gray-600 mb-6">Enter your order ID below to see its current status.</p>
      <form onSubmit={handleTrackOrder} className="flex gap-2">
        <input 
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID (e.g., 12345)"
          className="form-input flex-grow"
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </form>
      {status && (
        <div className={`mt-6 p-4 rounded-md ${status.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-800'}`}>
          {status.error ? <p>{status.message}</p> : (
            <div>
              <p className="font-semibold">Status for Order #{status.id}: <span className="capitalize">{status.stage}</span></p>
              <p>{status.message}</p>
              <p>Current Location: {status.location}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Sub-component for Profile Details
const ProfileDetails = ({ user }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Profile Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Display Name</label>
          <p className="mt-1 text-gray-900">{user?.displayName}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <p className="mt-1 text-gray-900">{user?.email}</p>
        </div>
        <div className="pt-6 border-t">
          <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
          <form className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input type="password" className="form-input mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input type="password" className="form-input mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input type="password" className="form-input mt-1" />
            </div>
            <button type="submit" className="btn-primary">Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
