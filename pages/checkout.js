// pages/checkout.js - Complete Checkout Page with Protected Route
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CreditCard, Truck, Lock, User, Mail, MapPin, Phone } from 'lucide-react';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { cartUtils } from '../utils/cartUtils';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePhone, validateCreditCard, validateZipCode } from '../utils/validation';

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Billing Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Shipping Information
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    // Payment Information
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    nameOnCard: '',
    // Options
    saveInfo: false,
    sameAsBilling: true,
    shippingMethod: 'standard',
    paymentMethod: 'card'
  });

  useEffect(() => {
    const currentCart = cartUtils.getCart();
    if (currentCart.length === 0) {
      router.push('/cart');
      return;
    }
    setCart(currentCart);

    // Pre-fill user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      }));
    }
  }, [router, user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';

    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    // Phone validation (optional but validate if provided)
    if (formData.phone) {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    // ZIP code validation
    const zipError = validateZipCode(formData.zipCode, formData.country);
    if (zipError) newErrors.zipCode = zipError;

    // Payment validation for credit card
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.expMonth) newErrors.expMonth = 'Expiration month is required';
      if (!formData.expYear) newErrors.expYear = 'Expiration year is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
      if (!formData.nameOnCard) newErrors.nameOnCard = 'Name on card is required';

      // Credit card validation
      if (formData.cardNumber) {
        const cardError = validateCreditCard(formData.cardNumber);
        if (cardError) newErrors.cardNumber = cardError;
      }

      // CVV validation
      if (formData.cvv && (formData.cvv.length < 3 || formData.cvv.length > 4)) {
        newErrors.cvv = 'CVV must be 3-4 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    setLoading(true);

    try {
      // Calculate totals
      const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
      const shipping = subtotal > 50 ? 0 : (formData.shippingMethod === 'express' ? 20 : 10);
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;

      // Prepare order data for WooCommerce
      const orderData = {
        payment_method: formData.paymentMethod,
        payment_method_title: formData.paymentMethod === 'card' ? 'Credit Card' : 'PayPal',
        set_paid: false, // Set to true if payment is processed
        billing: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          city: formData.city,
          state: formData.state,
          postcode: formData.zipCode,
          country: formData.country,
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          city: formData.city,
          state: formData.state,
          postcode: formData.zipCode,
          country: formData.country
        },
        line_items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        shipping_lines: [
          {
            method_id: formData.shippingMethod,
            method_title: formData.shippingMethod === 'express' ? 'Express Shipping' : 'Standard Shipping',
            total: shipping.toString()
          }
        ]
      };

      // Create order via WooCommerce API
      const order = await api.createOrder(orderData);
      
      // Clear cart
      cartUtils.clearCart();
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      // Redirect to success page
      router.push(`/order-success?order=${order.id}`);
      
    } catch (error) {
      console.error('Checkout error:', error);
      setErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : (formData.shippingMethod === 'express' ? 20 : 10);
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <ProtectedRoute>
      <Head>
        <title>Checkout - ChapterOne Bookstore</title>
        <meta name="description" content="Complete your book purchase securely at ChapterOne bookstore." />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        <div className="container py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-red-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/cart" className="hover:text-red-600">Cart</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Checkout</span>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600">Complete your order securely</p>
          </div>

          {/* Global Error */}
          {errors.submit && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Billing Information */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">1</span>
                    Billing Information
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`form-input pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                          placeholder="John"
                          required
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`form-input pl-10 ${errors.lastName ? 'border-red-500' : ''}`}
                          placeholder="Doe"
                          required
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`form-input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                          placeholder="john@example.com"
                          required
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`form-input pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                          placeholder="+1 (555) 123-4567"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`form-input pl-10 ${errors.address ? 'border-red-500' : ''}`}
                          placeholder="123 Main Street"
                          required
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`form-input ${errors.city ? 'border-red-500' : ''}`}
                        placeholder="New York"
                        required
                      />
                      {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`form-input ${errors.state ? 'border-red-500' : ''}`}
                        placeholder="NY"
                        required
                      />
                      {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`form-input ${errors.zipCode ? 'border-red-500' : ''}`}
                        placeholder="10001"
                        required
                      />
                      {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="form-select"
                        required
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">2</span>
                    Shipping Method
                  </h2>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={formData.shippingMethod === 'standard'}
                        onChange={handleInputChange}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Truck className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="font-medium">Standard Shipping</span>
                          </div>
                          <span className="font-semibold">
                            {subtotal > 50 ? 'FREE' : '$10.00'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">5-7 business days</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={formData.shippingMethod === 'express'}
                        onChange={handleInputChange}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Truck className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="font-medium">Express Shipping</span>
                          </div>
                          <span className="font-semibold">$20.00</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">2-3 business days</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">3</span>
                    Payment Information
                  </h2>
                  
                  {/* Payment Methods */}
                  <div className="space-y-3 mb-6">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <div className="ml-3 flex items-center">
                        <CreditCard className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="font-medium">Credit/Debit Card</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleInputChange}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <div className="ml-3 flex items-center">
                        <div className="w-5 h-5 bg-blue-600 rounded mr-2"></div>
                        <span className="font-medium">PayPal</span>
                      </div>
                    </label>
                  </div>

                  {/* Card Details */}
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className={`form-input ${errors.cardNumber ? 'border-red-500' : ''}`}
                          required={formData.paymentMethod === 'card'}
                        />
                        {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Month *
                          </label>
                          <select
                            name="expMonth"
                            value={formData.expMonth}
                            onChange={handleInputChange}
                            className={`form-select ${errors.expMonth ? 'border-red-500' : ''}`}
                            required={formData.paymentMethod === 'card'}
                          >
                            <option value="">MM</option>
                            {Array.from({ length: 12 }, (_, i) => (
                              <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                {String(i + 1).padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                          {errors.expMonth && <p className="mt-1 text-sm text-red-600">{errors.expMonth}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Year *
                          </label>
                          <select
                            name="expYear"
                            value={formData.expYear}
                            onChange={handleInputChange}
                            className={`form-select ${errors.expYear ? 'border-red-500' : ''}`}
                            required={formData.paymentMethod === 'card'}
                          >
                            <option value="">YYYY</option>
                            {Array.from({ length: 10 }, (_, i) => (
                              <option key={i} value={new Date().getFullYear() + i}>
                                {new Date().getFullYear() + i}
                              </option>
                            ))}
                          </select>
                          {errors.expYear && <p className="mt-1 text-sm text-red-600">{errors.expYear}</p>}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            className={`form-input ${errors.cvv ? 'border-red-500' : ''}`}
                            maxLength={4}
                            required={formData.paymentMethod === 'card'}
                          />
                          {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name on Card *
                        </label>
                        <input
                          type="text"
                          name="nameOnCard"
                          value={formData.nameOnCard}
                          onChange={handleInputChange}
                          className={`form-input ${errors.nameOnCard ? 'border-red-500' : ''}`}
                          placeholder="John Doe"
                          required={formData.paymentMethod === 'card'}
                        />
                        {errors.nameOnCard && <p className="mt-1 text-sm text-red-600">{errors.nameOnCard}</p>}
                      </div>
                    </div>
                  )}

                  {/* Save Info Checkbox */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Save this information for next time
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  
                  {/* Cart Items */}
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.image || '/images/placeholder-book.jpg'}
                          alt={item.name}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity} × ${item.price}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Totals */}
                  <div className="space-y-2 border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-2">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary flex items-center justify-center space-x-2 mb-4"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{loading ? 'Processing...' : 'Place Order'}</span>
                  </button>

                  {/* Security Notice */}
                  <div className="text-center text-xs text-gray-500">
                    <Lock className="w-3 h-3 inline mr-1" />
                    Your payment information is secure and encrypted
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CheckoutPage;