// pages/api/get-shiprocket-rates.js
import fetch from 'node-fetch';

async function getShiprocketToken() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error("Shiprocket credentials missing in environment variables.");
  }

  const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok || !data.token) {
    throw new Error("Failed to authenticate with Shiprocket.");
  }
  return data.token;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { delivery_postcode, cart } = req.body;
  const pickup_postcode = process.env.SHIPROCKET_PICKUP_POSTCODE;

  if (!delivery_postcode || !cart || cart.length === 0) {
    return res.status(400).json({ message: "Missing required fields: delivery_postcode and cart." });
  }

  try {
    const token = await getShiprocketToken();

    const total_weight_kg = cart.reduce((sum, item) => sum + (item.weight || 0.5) * item.quantity, 0);
    const declared_value = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

    const queryParams = new URLSearchParams({
      pickup_postcode: pickup_postcode.toString(),
      delivery_postcode: delivery_postcode.toString(),
      weight: total_weight_kg.toString(),
      cod: "0",
      declared_value: declared_value.toString(),
    }).toString();

    const ratesApiUrl = `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${queryParams}`;

    const ratesResponse = await fetch(ratesApiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const ratesData = await ratesResponse.json();

    // FIXED: Changed ratesData.status_code to ratesData.status
    if (ratesResponse.status !== 200 || ratesData.status !== 200) {
      console.error("Shiprocket API Error:", ratesData);
      return res.status(200).json({ rates: [] });
    }

    const availableRates = ratesData?.data?.available_courier_companies || [];
    res.status(200).json({ rates: availableRates });

  } catch (error) {
    console.error("Error in get-shiprocket-rates handler:", error);
    res.status(500).json({ message: error.message });
  }
}
