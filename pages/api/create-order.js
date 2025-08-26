// // pages/api/create-order.js
// import Razorpay from 'razorpay';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const orderData = req.body;

//   const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
//   const WC_CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
//   const WC_CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;
//   const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
//   const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET; // server-side only

//   if (!WC_API_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET || !RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
//     return res.status(500).json({ message: "API credentials not configured." });
//   }

//   // Encode WooCommerce credentials for Basic Auth
//   const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

//   try {
//     // 1️⃣ Create WooCommerce order
//     const wcResponse = await fetch(`${WC_API_URL}/wp-json/wc/v3/orders`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Basic ${auth}`
//       },
//       body: JSON.stringify(orderData)
//     });

//     if (!wcResponse.ok) {
//       const errorBody = await wcResponse.json();
//       console.error('WooCommerce API Error:', errorBody);
//       throw new Error(errorBody.message || 'Failed to create WooCommerce order.');
//     }

//     const wcOrder = await wcResponse.json();

//     // 2️⃣ Create Razorpay order independently
//     const razorpay = new Razorpay({
//       key_id: RAZORPAY_KEY_ID,
//       key_secret: RAZORPAY_KEY_SECRET
//     });

//     const subtotal = orderData.line_items.reduce((sum, item) => sum + item.quantity * parseFloat(item.price || 0), 0);
//     const shipping = orderData.shipping_lines?.[0]?.total ? parseFloat(orderData.shipping_lines[0].total) : 0;
//     const totalAmount = Math.round((subtotal + shipping) * 100); // in paise

//     const rzpOrder = await razorpay.orders.create({
//       amount: totalAmount,
//       currency: 'INR',
//       receipt: `wc_order_${wcOrder.id}`,
//       payment_capture: 1
//     });

//     // 3️⃣ Return both WooCommerce order ID and Razorpay order ID
//     res.status(200).json({
//       id: wcOrder.id,
//       total: wcOrder.total,
//       razorpay_order_id: rzpOrder.id
//     });

//   } catch (error) {
//     console.error('Error in /api/create-order:', error);
//     res.status(500).json({ message: error.message || 'An internal server error occurred.' });
//   }
// }


// pages/api/create-order.js
import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const orderData = req.body;

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

    const razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET
    });

    const subtotal = orderData.line_items.reduce((sum, item) => sum + item.quantity * parseFloat(item.price || 0), 0);
    const shipping = orderData.shipping_lines?.[0]?.total ? parseFloat(orderData.shipping_lines[0].total) : 0;
    const totalAmount = Math.round((subtotal + shipping) * 100);

    const rzpOrder = await razorpay.orders.create({
      amount: totalAmount,
      currency: 'INR',
      receipt: `wc_order_${wcOrder.id}`,
      payment_capture: 1,
      notes: {
        woocommerce_order_id: wcOrder.id // <-- This is the required addition
      }
    });

    res.status(200).json({
      id: wcOrder.id,
      total: wcOrder.total,
      razorpay_order_id: rzpOrder.id
    });

  } catch (error) {
    console.error('Error in /api/create-order:', error);
    res.status(500).json({ message: error.message || 'An internal server error occurred.' });
  }
}