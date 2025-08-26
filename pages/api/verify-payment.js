// // pages/api/verify-payment.js
// import crypto from 'crypto';
// import fetch from 'node-fetch';

// // Function to get Shiprocket authentication token
// async function getShiprocketToken() {
//   const email = process.env.SHIPROCKET_EMAIL;
//   const password = process.env.SHIPROCKET_PASSWORD;
  
//   console.log("Attempting to get Shiprocket token...");
  
//   const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
  
//   const data = await response.json();
  
//   if (!response.ok || !data.token) {
//     console.error("Failed to authenticate with Shiprocket. Response:", data);
//     throw new Error("Failed to authenticate with Shiprocket for shipment creation.");
//   }
  
//   console.log("Successfully obtained Shiprocket token.");
//   return data.token;
// }

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
//   if (!secret) {
//     console.error("FATAL: Razorpay webhook secret is not configured.");
//     return res.status(500).json({ message: "Webhook secret is not configured." });
//   }

//   console.log("\n--- New Webhook Received ---");
//   console.log("Headers:", JSON.stringify(req.headers, null, 2));
//   console.log("Body:", JSON.stringify(req.body, null, 2));

//   // 1. Verify Razorpay Signature
//   const shasum = crypto.createHmac('sha256', secret);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest('hex');

//   if (digest !== req.headers['x-razorpay-signature']) {
//     console.error("Signature Verification FAILED. Digest:", digest, "Header:", req.headers['x-razorpay-signature']);
//     return res.status(400).json({ message: 'Invalid signature' });
//   }

//   console.log("Signature Verification SUCCESSFUL.");

//   // Signature is verified, process the event
//   const { event, payload } = req.body;
//   console.log(`Processing event: ${event}`);

//   if (event === 'payment.captured') {
//     const payment = payload.payment.entity;
//     const wooCommerceOrderId = payment.notes.woocommerce_order_id;

//     console.log("WooCommerce Order ID from notes:", wooCommerceOrderId);

//     if (wooCommerceOrderId) {
//       const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
//       const WC_CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
//       const WC_CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;
//       const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

//       try {
//         // 2. Update WooCommerce Order Status
//         console.log(`Updating WooCommerce order ${wooCommerceOrderId} to 'processing'...`);
//         await fetch(`${WC_API_URL}/wp-json/wc/v3/orders/${wooCommerceOrderId}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Basic ${auth}`
//           },
//           body: JSON.stringify({
//             status: 'processing',
//             transaction_id: payment.id
//           })
//         });
//         console.log(`Order ${wooCommerceOrderId} successfully updated.`);

//         // 3. Fetch full order details from WooCommerce
//         console.log(`Fetching full details for order ${wooCommerceOrderId}...`);
//         const orderResponse = await fetch(`${WC_API_URL}/wp-json/wc/v3/orders/${wooCommerceOrderId}`, {
//             headers: { 'Authorization': `Basic ${auth}` }
//         });
//         const orderData = await orderResponse.json();
//         console.log("Fetched WooCommerce order data:", JSON.stringify(orderData, null, 2));

//         // 4. Create Shipment in Shiprocket
//         const shiprocketToken = await getShiprocketToken();
//         const subTotal = orderData.line_items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
        
//         const shiprocketOrderPayload = {
//           order_id: orderData.id.toString(),
//           order_date: orderData.date_created.slice(0, 10),
//           pickup_location: process.env.SHIPROCKET_PICKUP_NAME,
//           channel_id: process.env.SHIPROCKET_CHANNEL_ID,
//           billing_customer_name: `${orderData.billing.first_name} ${orderData.billing.last_name}`.trim(),
//           billing_last_name: orderData.billing.last_name,
//           billing_address: orderData.billing.address_1,
//           billing_address_2: orderData.billing.address_2,
//           billing_city: orderData.billing.city,
//           billing_pincode: orderData.billing.postcode,
//           billing_state: orderData.billing.state,
//           billing_country: orderData.billing.country,
//           billing_email: orderData.billing.email,
//           billing_phone: orderData.billing.phone,
//           shipping_is_billing: true,
//           order_items: orderData.line_items.map(item => ({
//             name: item.name,
//             sku: item.sku || `prod-${item.product_id}`,
//             units: item.quantity,
//             selling_price: item.price,
//             hsn: 49011010
//           })),
//           payment_method: "Prepaid",
//           shipping_charges: parseFloat(orderData.shipping_total) || 0,
//           total_discount: parseFloat(orderData.discount_total) || 0,
//           sub_total: subTotal,
//           length: 10,
//           breadth: 10,
//           height: 10,
//           weight: orderData.line_items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0.5) * item.quantity, 0)
//         };
        
//         console.log("Sending the following payload to Shiprocket:", JSON.stringify(shiprocketOrderPayload, null, 2));

//         const shipmentResponse = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${shiprocketToken}`
//             },
//             body: JSON.stringify(shiprocketOrderPayload)
//         });

//         const shipmentData = await shipmentResponse.json();
//         if(!shipmentResponse.ok) {
//             console.error("Failed to create Shiprocket shipment. Status:", shipmentResponse.status, "Response:", JSON.stringify(shipmentData, null, 2));
//         } else {
//             console.log(`Shiprocket shipment created successfully for Order #${orderData.id}. Shipment ID: ${shipmentData.shipment_id}, Shiprocket Order ID: ${shipmentData.order_id}`);
//         }

//       } catch (error) {
//         console.error(`Failed to process order ${wooCommerceOrderId}:`, error);
//       }
//     } else {
//       console.warn("Webhook received for a payment without a WooCommerce Order ID in the notes.");
//     }
//   }

//   res.status(200).json({ status: 'ok' });
// }

// pages/api/verify-payment.js
import crypto from 'crypto';
import fetch from 'node-fetch';

// Function to get Shiprocket authentication token
async function getShiprocketToken() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  
  console.log("Attempting to get Shiprocket token...");
  
  const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (!response.ok || !data.token) {
    console.error("Failed to authenticate with Shiprocket. Response:", data);
    throw new Error("Failed to authenticate with Shiprocket for shipment creation.");
  }
  
  console.log("Successfully obtained Shiprocket token.");
  return data.token;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("FATAL: Razorpay webhook secret is not configured.");
    return res.status(500).json({ message: "Webhook secret is not configured." });
  }

  console.log("\n--- New Webhook Received ---");
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Body:", JSON.stringify(req.body, null, 2));

  // 1. Verify Razorpay Signature
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest !== req.headers['x-razorpay-signature']) {
    console.error("Signature Verification FAILED. Digest:", digest, "Header:", req.headers['x-razorpay-signature']);
    return res.status(400).json({ message: 'Invalid signature' });
  }

  console.log("Signature Verification SUCCESSFUL.");

  // Signature is verified, process the event
  const { event, payload } = req.body;
  console.log(`Processing event: ${event}`);

  if (event === 'payment.captured') {
    const payment = payload.payment.entity;
    const wooCommerceOrderId = payment.notes.woocommerce_order_id;

    console.log("WooCommerce Order ID from notes:", wooCommerceOrderId);

    if (wooCommerceOrderId) {
      const WC_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;
      const WC_CONSUMER_KEY = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
      const WC_CONSUMER_SECRET = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;
      const auth = Buffer.from(`${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`).toString('base64');

      try {
        // 2. Update WooCommerce Order Status
        console.log(`Updating WooCommerce order ${wooCommerceOrderId} to 'processing'...`);
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
        console.log(`Order ${wooCommerceOrderId} successfully updated.`);

        // 3. Fetch full order details from WooCommerce
        console.log(`Fetching full details for order ${wooCommerceOrderId}...`);
        const orderResponse = await fetch(`${WC_API_URL}/wp-json/wc/v3/orders/${wooCommerceOrderId}`, {
            headers: { 'Authorization': `Basic ${auth}` }
        });
        const orderData = await orderResponse.json();
        console.log("Fetched WooCommerce order data:", JSON.stringify(orderData, null, 2));

        // 4. Create Shipment in Shiprocket
        const shiprocketToken = await getShiprocketToken();
        const subTotal = orderData.line_items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
        
        const shiprocketOrderPayload = {
          order_id: orderData.id.toString(),
          order_date: orderData.date_created.slice(0, 10),
          pickup_location: process.env.SHIPROCKET_PICKUP_NAME,
          channel_id: process.env.SHIPROCKET_CHANNEL_ID,
          billing_customer_name: `${orderData.billing.first_name} ${orderData.billing.last_name}`.trim(),
          billing_last_name: orderData.billing.last_name,
          billing_address: orderData.billing.address_1,
          billing_address_2: orderData.billing.address_2,
          billing_city: orderData.billing.city,
          billing_pincode: orderData.billing.postcode,
          billing_state: orderData.billing.state,
          billing_country: orderData.billing.country,
          billing_email: orderData.billing.email,
          billing_phone: orderData.billing.phone,
          shipping_is_billing: true,
          order_items: orderData.line_items.map(item => ({
            name: item.name,
            sku: item.sku || `prod-${item.product_id}`,
            units: item.quantity,
            selling_price: item.price,
            hsn: 49011010
          })),
          payment_method: "Prepaid",
          shipping_charges: parseFloat(orderData.shipping_total) || 0,
          total_discount: parseFloat(orderData.discount_total) || 0,
          sub_total: subTotal,
          length: 10,
          breadth: 10,
          height: 10,
          weight: orderData.line_items.reduce((sum, item) => sum + (parseFloat(item.weight) || 0.5) * item.quantity, 0)
        };
        
        console.log("Sending the following payload to Shiprocket:", JSON.stringify(shiprocketOrderPayload, null, 2));

        const shipmentResponse = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${shiprocketToken}`
            },
            body: JSON.stringify(shiprocketOrderPayload)
        });

        const shipmentData = await shipmentResponse.json();
        
        console.log("Received response from Shiprocket. Status:", shipmentResponse.status, "Body:", JSON.stringify(shipmentData, null, 2));

        if(!shipmentResponse.ok) {
            console.error("Shiprocket shipment creation FAILED.");
        } else {
            console.log(`Shiprocket shipment created successfully for Order #${orderData.id}.`);
        }

      } catch (error) {
        console.error(`Failed to process order ${wooCommerceOrderId}:`, error);
      }
    } else {
      console.warn("Webhook received for a payment without a WooCommerce Order ID in the notes.");
    }
  }

  res.status(200).json({ status: 'ok' });
}
