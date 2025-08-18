// pages/checkout.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Lock, User, Mail, MapPin, Phone, Truck } from 'lucide-react';
import ProtectedRoute from '../components/common/ProtectedRoute';
import { cartUtils } from '../utils/cartUtils';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePhone, validateZipCode } from '../utils/validation';

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [shippingRates, setShippingRates] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'IN',
    saveInfo: false,
    shippingMethod: null,
    paymentMethod: 'razorpay'
  });

  useEffect(() => {
    const currentCart = cartUtils.getCart();
    if (!currentCart || currentCart.length === 0) router.push('/cart');
    else setCart(currentCart);

    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.firstName || user.displayName?.split(' ')[0] || '',
        lastName: user.lastName || user.displayName?.split(' ')[1] || ''
      }));
    }
  }, [router, user]);

  useEffect(() => {
    const fetchRates = async () => {
      if (!formData.zipCode || cart.length === 0) return;

      try {
        const response = await fetch('/api/get-shiprocket-rates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            delivery_postcode: formData.zipCode,
            cart: cart.map(item => ({ weight: item.weight || 0.5, quantity: item.quantity, price: item.price }))
          })
        });

        const data = await response.json();
        console.log('Shipping Rates:', data);

        if (data.rates && data.rates.length > 0) {
          const mappedRates = data.rates.map(rate => ({
            ...rate,
            shipping_charges: parseFloat(rate.rate) // Shiprocket uses 'rate' for shipping charges
          }));
          setShippingRates(mappedRates);
          setSelectedShipping(mappedRates[0]);
        } else {
          setShippingRates([]);
          setSelectedShipping(null);
        }
      } catch (err) {
        console.error('Error fetching shipping rates:', err);
        setShippingRates([]);
        setSelectedShipping(null);
      }
    };

    const debounceFetch = setTimeout(() => {
        fetchRates();
    }, 500); // Debounce to avoid rapid API calls while typing ZIP

    return () => clearTimeout(debounceFetch);
  }, [formData.zipCode, cart]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email || !validateEmail(formData.email)) newErrors.email = 'A valid email is required';
    if (formData.phone && !validatePhone(formData.phone)) newErrors.phone = 'A valid phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode || !validateZipCode(formData.zipCode, 'IN')) newErrors.zipCode = 'A valid ZIP code is required';
    if (!selectedShipping) newErrors.shippingMethod = 'Select a shipping method';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
      const shipping = selectedShipping ? selectedShipping.shipping_charges : 0;
      const totalAmount = subtotal + shipping;

      const orderData = {
        payment_method: 'razorpay',
        payment_method_title: 'Razorpay',
        set_paid: false,
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
          quantity: item.quantity,
          price: item.price.toString()
        })),
        shipping_lines: [
          {
            method_id: 'shiprocket',
            method_title: selectedShipping.courier_name || 'Shiprocket',
            total: shipping.toString()
          }
        ]
      };

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create order');

      if (data.razorpay_order_id) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: totalAmount * 100,
          currency: 'INR',
          name: 'porboi.in',
          description: `Order #${data.id}`,
          order_id: data.razorpay_order_id,
          handler: function (res) {
            cartUtils.clearCart();
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            router.push(`/order-success?order=${data.id}&payment_id=${res.razorpay_payment_id}`);
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone
          },
          theme: { color: '#dc2626' }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else throw new Error('Razorpay Order ID not received.');
    } catch (err) {
      console.error(err);
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const shipping = selectedShipping ? selectedShipping.shipping_charges : 0;
  const total = subtotal + shipping;

  return (
    <ProtectedRoute>
      <Head>
        <title>Checkout - porboi.in</title>
        <meta name="description" content="Complete your book purchase securely at porboi.in." />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </Head>

      <div className="bg-gray-50 min-h-screen">
        <div className="container py-8">
          <nav className="text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-red-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/cart" className="hover:text-red-600">Cart</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Checkout</span>
          </nav>

          {errors.submit && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{errors.submit}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Billing & Shipping */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing & Shipping Details</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Form Fields */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`form-input ${errors.firstName ? 'border-red-500' : ''}`} required />
                      {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`form-input ${errors.lastName ? 'border-red-500' : ''}`} required />
                      {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`form-input ${errors.email ? 'border-red-500' : ''}`} required />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className={`form-input ${errors.phone ? 'border-red-500' : ''}`} />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={`form-input ${errors.address ? 'border-red-500' : ''}`} required />
                      {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={`form-input ${errors.city ? 'border-red-500' : ''}`} required />
                      {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input type="text" name="state" value={formData.state} onChange={handleInputChange} className={`form-input ${errors.state ? 'border-red-500' : ''}`} required />
                      {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                      <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className={`form-input ${errors.zipCode ? 'border-red-500' : ''}`} required />
                      {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                      <input type="text" name="country" value="India" disabled className="form-input bg-gray-100" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm text-gray-700">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Shipping Method</h4>
                    <div className="space-y-3">
                      {shippingRates.length === 0 ? (
                        <p className="text-sm text-gray-500">Enter a valid ZIP code to see shipping options.</p>
                      ) : (
                        shippingRates.map(rate => (
                          <label key={rate.courier_company_id} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${selectedShipping?.courier_company_id === rate.courier_company_id ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-400'}`}>
                            <input
                              type="radio"
                              name="shippingMethod"
                              value={rate.courier_name}
                              checked={selectedShipping?.courier_company_id === rate.courier_company_id}
                              onChange={() => setSelectedShipping(rate)}
                              className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                            />
                            <div className="ml-3 flex-1 flex justify-between items-center">
                              <div>
                                <p className="font-medium text-gray-800">{rate.courier_name}</p>
                                <p className="text-sm text-gray-500">Est. Delivery: {rate.etd}</p>
                              </div>
                              <p className="font-semibold text-gray-900">₹{rate.shipping_charges.toFixed(2)}</p>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                    {errors.shippingMethod && <p className="mt-1 text-sm text-red-600">{errors.shippingMethod}</p>}
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>{selectedShipping ? `₹${shipping.toFixed(2)}` : '---'}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-gray-200 pt-2 mt-2">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="w-full btn-primary mt-4 flex items-center justify-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>{loading ? 'Processing...' : 'Proceed to Payment'}</span>
                  </button>
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
