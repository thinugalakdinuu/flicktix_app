import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { phoneNumber } = req.body;

  if (!phoneNumber) return res.status(400).json({ error: "Phone number is required" });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    // Save OTP to session or database (for demo, using a simple object)
    global.otpStore = { phoneNumber, otp };

    await client.messages.create({
      body: `Your FlickTix verification code is: ${otp}`,
      from: twilioPhone,
      to: phoneNumber,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Twilio Error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}
