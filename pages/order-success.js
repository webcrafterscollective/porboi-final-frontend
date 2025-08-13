// pages/order-success.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { CheckCircle, Download, Mail } from 'lucide-react';

const OrderSuccessPage = () => {
  const router = useRouter();
  const { order } = router.query;
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (order) {
      // In a real app, fetch order details from API
      // For now, we'll use mock data
      setOrderDetails({
        id: order,
        date: new Date().toLocaleDateString(),
        total: '89.97',
        email: 'customer@example.com'
      });
    }
  }, [order]);

  return (
    <>
      <Head>
        <title>Order Confirmation - ChapterOne Bookstore</title>
        <meta name="description" content="Your order has been successfully placed at ChapterOne bookstore." />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        <div className="container section-padding">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="mb-8">
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-serif text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your purchase. Your order has been successfully placed and you will receive a confirmation email shortly.
            </p>

            {/* Order Details */}
            {orderDetails && (
              <div className="bg-white rounded-lg p-6 mb-8 text-left">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Order Number:</span>
                    <p className="font-medium">#{orderDetails.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Order Date:</span>
                    <p className="font-medium">{orderDetails.date}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Amount:</span>
                    <p className="font-medium">${orderDetails.total}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{orderDetails.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <button className="btn-primary">
                  Continue Shopping
                </button>
              </Link>
              <button className="btn-secondary flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Receipt</span>
              </button>
            </div>

            {/* Next Steps */}
            <div className="mt-12 bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-500" />
                  <span>You'll receive an email confirmation within the next few minutes</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span>Your order will be processed and shipped within 1-2 business days</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-500" />
                  <span>You'll receive tracking information once your order ships</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessPage;