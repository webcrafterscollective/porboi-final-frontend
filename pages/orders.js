// pages/orders.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from '../components/common/ProtectedRoute';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { api } from '../lib/api'; // We'll update this file next
import { formatDate, formatPrice } from '../utils/formatters';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.email) {
        try {
          // Note: Fetching all orders and filtering client-side is not ideal for production.
          // A dedicated server-side endpoint is recommended for fetching orders for a specific user.
          const allOrders = await api.getOrders(); 
          const userOrders = allOrders.filter(order => order.billing.email === user.email);
          setOrders(userOrders);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <ProtectedRoute>
      <Head>
        <title>My Orders - porboi.in</title>
      </Head>
      <div className="bg-gray-50 min-h-screen">
        <div className="container section-padding">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif text-gray-900">Order History</h1>
            <p className="text-gray-600 mt-2">View your past and current orders.</p>
          </div>

          <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            {loading ? (
              <LoadingSpinner text="Fetching your orders..." />
            ) : orders.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {orders.map(order => (
                  <div key={order.id} className="py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">Placed on {formatDate(order.date_created)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium px-2 py-1 rounded-full capitalize ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </p>
                        <p className="font-semibold mt-1">{formatPrice(order.total, order.currency)}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      {order.line_items.map(item => (
                        <div key={item.id} className="flex items-center text-sm text-gray-600">
                          <span>{item.quantity} x {item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-600">You haven't placed any orders yet.</p>
                <Link href="/shop" className="text-red-600 font-semibold mt-2 inline-block">
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrdersPage;
