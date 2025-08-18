// pages/api/verify-payment.js
import crypto from 'crypto';
import fetch from 'node-fetch';

// Function to get Shiprocket authentication token
async function getShiprocketToken() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok || !data.token) {
    throw new Error("Failed to authenticate with Shiprocket for shipment creation.");
  }
  return data.token;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Razorpay webhook secret is not configured.");
    return res.status(500).json({ message: "Webhook secret is not configured." });
  }

  // 1. Verify Razorpay Signature
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest !== req.headers['x-razorpay-signature']) {
    console.error("Webhook signature verification failed.");
    return res.status(400).json({ message: 'Invalid signature' });
  }

  // Signature is verified, process the event
  const { event, payload } = req.body;

  if (event === 'payment.captured') {
    const payment = payload.payment.entity;
    const wooCommerceOrderId = payment.notes.woocommerce_order_id;

    if (wooCommerceOrderId) {
      const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
      const WC_CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
      const WC_CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;
      const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

      try {
        // 2. Update WooCommerce Order Status
        await fetch(`${WC_API_URL}/wp-json/wc/v3/orders/${wooCommerceOrderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`
          },
          body: JSON.stringify({
            status: 'processing',
            transaction_id: payment.id
          })
        });
        console.log(`Order ${wooCommerceOrderId} updated to processing.`);

        // 3. Fetch full order details from WooCommerce to create shipment
        const orderResponse = await fetch(`${WC_API_URL}/wp-json/wc/v3/orders/${wooCommerceOrderId}`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const orderData = await orderResponse.json();

        // 4. Create Shipment in Shiprocket
        const shiprocketToken = await getShiprocketToken();
        const shiprocketOrderPayload = {
          order_id: orderData.id.toString(),
          order_date: orderData.date_created.slice(0, 10),
          pickup_location: process.env.SHIPROCKET_PICKUP_NAME,
          billing_customer_name: orderData.billing.first_name,
          billing_last_name: orderData.billing.last_name,
          billing_address: orderData.billing.address_1,
          billing_address_2: orderData.billing.address_2,
          billing_city: orderData.billing.city,
          billing_pincode: orderData.billing.postcode,
          billing_state: orderData.billing.state,
          billing_country: orderData.billing.country,
          billing_email: orderData.billing.email,
          billing_phone: orderData.billing.phone,
          shipping_is_billing: true, // Assuming shipping is same as billing
          order_items: orderData.line_items.map(item => ({
            name: item.name,
            sku: item.sku || `prod-${item.product_id}`,
            units: item.quantity,
            selling_price: item.price,
            hsn: 49011010 // Example HSN code for books, change if needed
          })),
          payment_method: "Prepaid",
          shipping_charges: orderData.shipping_total,
          total_discount: orderData.discount_total,
          sub_total: orderData.total,
          length: 10, // Example dimensions in cm, adjust as needed
          breadth: 10,
          height: 10,
          weight: orderData.line_items.reduce((sum, item) => sum + (item.weight || 0.5) * item.quantity, 0)
        };
        
        const shipmentResponse = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${shiprocketToken}`
            },
            body: JSON.stringify(shiprocketOrderPayload)
        });

        const shipmentData = await shipmentResponse.json();
        if(!shipmentResponse.ok) {
            console.error("Failed to create Shiprocket shipment:", shipmentData);
        } else {
            console.log(`Shiprocket shipment created successfully for Order #${orderData.id}. Shipment ID: ${shipmentData.shipment_id}`);
        }

      } catch (error) {
        console.error(`Failed to process order ${wooCommerceOrderId}:`, error);
      }
    }
  }

  res.status(200).json({ status: 'ok' });
}
