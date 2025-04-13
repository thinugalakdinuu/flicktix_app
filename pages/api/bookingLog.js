import CryptoJS from "crypto-js";

export default function handler(req, res) {
  if (req.method === "POST") {
    const bookingData = req.body;
    console.log("📥 Received booking data:", bookingData);

  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
