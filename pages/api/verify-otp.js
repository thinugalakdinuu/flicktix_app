export default function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
  
    const { phoneNumber, otp } = req.body;
  
    if (!phoneNumber || !otp) return res.status(400).json({ error: "Phone and OTP required" });
  
    if (global.otpStore?.phoneNumber === phoneNumber && global.otpStore?.otp == otp) {
      return res.status(200).json({ success: true, message: "OTP verified" });
    } else {
      return res.status(400).json({ error: "Invalid OTP" });
    }
  }
  