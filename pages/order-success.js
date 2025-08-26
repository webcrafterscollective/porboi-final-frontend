// pages/order-success.js
import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { CheckCircle, Download, Mail } from 'lucide-react';
import { api } from '../lib/api';
import { formatDate, formatPrice } from '../utils/formatters';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LoadingSpinner from '../components/common/LoadingSpinner';

const OrderSuccessPage = ({ orderDetails, error }) => {
  const router = useRouter();

  if (router.isFallback || !orderDetails && !error) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="large" text="Loading order details..." /></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="text-gray-600">{error}</p>
          <Link href="/shop">
            <button className="mt-4 btn-primary">Go to Shop</button>
          </Link>
        </div>
      </div>
    );
  }

  const handleDownloadReceipt = () => {
    const receiptElement = document.getElementById('receipt');
    if (receiptElement) {
      html2canvas(receiptElement, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`porboi-receipt-${orderDetails.id}.pdf`);
      });
    }
  };

  return (
    <>
      <Head>
        <title>Order Confirmation - porboi.in</title>
        <meta name="description" content="Your order has been successfully placed at porboi.in." />
      </Head>

      {/* Hidden PDF Receipt Template */}
      <div id="receipt" className="absolute -left-full w-[210mm] bg-white p-8 text-gray-900">
        <div className="border-b-2 border-gray-200 pb-4 mb-8">
          <div className="flex justify-between items-center">
            <img src="/logo.svg" alt="porboi.in logo" className="h-20" />
            <div className="text-right">
              <h1 className="text-3xl font-bold">RECEIPT</h1>
              <p className="text-gray-600">Order #{orderDetails.id}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="font-bold mb-2">Billed To:</h2>
            <p>{orderDetails.billing.first_name} {orderDetails.billing.last_name}</p>
            <p>{orderDetails.billing.address_1}</p>
            {orderDetails.billing.address_2 && <p>{orderDetails.billing.address_2}</p>}
            <p>{orderDetails.billing.city}, {orderDetails.billing.state} {orderDetails.billing.postcode}</p>
            <p>{orderDetails.billing.email}</p>
          </div>
          <div className="text-right">
            <p><span className="font-bold">Receipt Date:</span> {formatDate(orderDetails.date_created)}</p>
            <p><span className="font-bold">Payment Method:</span> {orderDetails.payment_method_title}</p>
          </div>
        </div>
        <table className="w-full text-left mb-8">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Item</th>
              <th className="p-2 text-center">Quantity</th>
              <th className="p-2 text-right">Price</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.line_items.map(item => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-center">{item.quantity}</td>
                <td className="p-2 text-right">{formatPrice(item.price, orderDetails.currency)}</td>
                <td className="p-2 text-right">{formatPrice(item.total, orderDetails.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex justify-between text-gray-700"><span>Subtotal</span><span>{formatPrice(orderDetails.line_items.reduce((acc, item) => acc + parseFloat(item.total), 0), orderDetails.currency)}</span></div>
            <div className="flex justify-between text-gray-700"><span>Shipping</span><span>{formatPrice(orderDetails.shipping_total, orderDetails.currency)}</span></div>
            <div className="flex justify-between font-bold text-xl mt-2 pt-2 border-t"><span>Total</span><span>{formatPrice(orderDetails.total, orderDetails.currency)}</span></div>
          </div>
        </div>
        <div className="text-center mt-16 text-gray-600">
          <p>Thank you for your purchase!</p>
          <p>porboi.in</p>
        </div>
      </div>

      {/* Visible Page Content */}
      <div className="bg-gray-50 min-h-screen">
        <div className="container section-padding">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
            </div>
            <h1 className="text-3xl font-serif text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your purchase. Your order has been successfully placed and you will receive a confirmation email shortly.
            </p>
            <div className="bg-white rounded-lg p-6 mb-8 text-left shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Order Number:</span>
                  <p className="font-medium">#{orderDetails.id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Order Date:</span>
                  <p className="font-medium">{formatDate(orderDetails.date_created)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Total Amount:</span>
                  <p className="font-medium">{formatPrice(orderDetails.total, orderDetails.currency)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{orderDetails.billing.email}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <button className="btn-primary">
                  Continue Shopping
                </button>
              </Link>
              <button onClick={handleDownloadReceipt} className="btn-secondary flex items-center justify-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Receipt</span>
              </button>
            </div>
            <div className="mt-12 bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
              <div className="space-y-3 text-sm text-gray-600 text-left">
                <div className="flex items-center"><Mail className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" /><span>You'll receive an email confirmation within the next few minutes.</span></div>
                <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" /><span>Your order will be processed and shipped within 1-2 business days.</span></div>
                <div className="flex items-center"><Mail className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" /><span>You'll receive tracking information once your order ships.</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { order } = context.query;

  if (!order) {
    return { props: { error: "No order ID found." } };
  }

  try {
    // **FIX: Use the correct function to get order details**
    const orderDetails = await api.getOrder(order); 
    return {
      props: { orderDetails },
    };
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    return {
      props: { error: "Could not retrieve your order details. Please check your account page or contact support." },
    };
  }
}

export default OrderSuccessPage;
