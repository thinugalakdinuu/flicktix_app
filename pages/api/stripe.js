import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Stripe API key is missing" });
  }

  try {
    console.log("Received request:", req.body);

    const {
      items,
      totalPrice,
      uniqueBookingId,
      theaterStripeId,
      mobileNumberHash,
      showDate,
      showTime,
      theaterName,
      movieName,
      selectedSeats,
      adultPrice,
      childPrice,
    } = req.body;

    if (!items || !movieName || !theaterName || !selectedSeats || !showDate || !showTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get adultQty and childrenQty
    const adultQty = items.find((item) => item.name === "Adult Ticket")?.quantity || 0;
    const childrenQty = items.find((item) => item.name === "Child Ticket")?.quantity || 0;

    console.log("Adult Quantity:", adultQty);
    console.log("Children Quantity:", childrenQty);

    // Make sure at least one ticket type is selected
    if (adultQty === 0 && childrenQty === 0) {
      return res.status(400).json({ error: "No tickets selected" });
    }

    // Ensure you pass only non-zero quantities for tickets
    const lineItems = [
      ...(adultQty > 0
        ? [{
            price_data: {
              currency: "lkr",
              product_data: {
                name: "Adult Ticket",
                description: `For movie ${movieName} at ${showTime}`,
              },
              unit_amount: adultPrice * 100, // Price for adult ticket
            },
            quantity: adultQty,
          }]
        : []),
      ...(childrenQty > 0
        ? [{
            price_data: {
              currency: "lkr",
              product_data: {
                name: "Child Ticket",
                description: `For movie ${movieName} at ${showTime}`,
              },
              unit_amount: childPrice * 100, // Price for child ticket
            },
            quantity: childrenQty,
          }]
        : []),
    ];

    if (lineItems.length === 0) {
      return res.status(400).json({ error: "No tickets selected" });
    }

    // Calculate total amount
    const totalAmount = lineItems.reduce(
      (sum, item) => sum + item.price_data.unit_amount * item.quantity,
      0
    );

    const platformFeePercentage = 0.1;
    const platformFee = Math.round(totalAmount * platformFeePercentage); // 10% of the total amount
    const theaterAmount = totalAmount - platformFee;

    // Get current timestamp
    const timestamp = new Date().toISOString();

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.origin}/success?booking=${uniqueBookingId}`,
      cancel_url: `${req.headers.origin}/canceled`,
      payment_intent_data: {
        transfer_data: {
          destination: theaterStripeId, // Theater's Stripe account ID
          amount: theaterAmount, // Amount after platform fee
        },
      },
      metadata: {
        movieName,
        theaterName,
        selectedSeats: selectedSeats.join(", "),
        showDate,
        showTime,
        totalPrice: totalAmount / 100, // Convert to dollars
        timestamp,
        uniqueBookingId,
        mobileNumberHash,
      },
    });

    console.log("Stripe session created:", session);

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe API Error:", error);
    res.status(500).json({
      error: "Failed to create checkout session and transfer",
      details: error.message,
    });
  }
}
