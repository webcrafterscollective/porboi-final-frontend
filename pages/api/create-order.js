// pages/api/create-order.js
import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Destructure the new payload from the request body
  const { orderData, customTotal } = req.body;

  const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const WC_CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
  const WC_CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;
  const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

  if (!WC_API_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET || !RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ message: "API credentials not configured." });
  }

  const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

  try {
    // Step 1: Create the order in WooCommerce for record-keeping.
    const wcResponse = await fetch(`${WC_API_URL}/wp-json/wc/v3/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(orderData)
    });

    if (!wcResponse.ok) {
      const errorBody = await wcResponse.json();
      console.error('WooCommerce API Error:', errorBody);
      throw new Error(errorBody.message || 'Failed to create WooCommerce order.');
    }

    const wcOrder = await wcResponse.json();

    // Step 2: Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });

    // Step 3: Use the final total calculated on the frontend for Razorpay.
    const finalAmountInPaise = Math.round(parseFloat(customTotal) * 100);

    const rzpOrder = await razorpay.orders.create({
      amount: finalAmountInPaise,
      currency: 'INR',
      receipt: `wc_order_${wcOrder.id}`,
      payment_capture: 1,
      notes: {
        woocommerce_order_id: wcOrder.id
      }
    });

    // Step 4: Return the IDs and the total that was used for payment to the frontend
    res.status(200).json({
      id: wcOrder.id,
      total: customTotal, // Send back the total that was actually charged
      razorpay_order_id: rzpOrder.id
    });

  } catch (error) {
    console.error('Error in /api/create-order:', error);
    res.status(500).json({ message: error.message || 'An internal server error occurred.' });
  }
}
