import fs from "fs";
import path from "path";
import { exec } from "child_process";
import axios from "axios";
import { client } from "@/lib/client";
const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const sessionFilePath = path.join(process.cwd(), "latestSession.json");

async function validateEvent(eventId) {
  try {
    const event = await stripe.events.retrieve(eventId);
    return event;
  } catch (err) {
    console.error("Error fetching event from Stripe:", err);
    return null;
  }
}

async function processSessionData(sessionData) {
  // Assuming sessionData contains metadata needed for booking
  const metadata = sessionData.metadata;

  if (!metadata) {
    throw new Error("No metadata found in session.");
  }

  // Generate a 6-character booking ID
  function generateBookingId() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let bookingId = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      bookingId += characters[randomIndex];
    }
    return bookingId;
  }

  const bookingId = generateBookingId();

  // Get the timestamp from metadata and convert to datetime
  const timestampFromMetadata = metadata.timestamp;
  let createdAt;

  if (timestampFromMetadata && !isNaN(Date.parse(timestampFromMetadata))) {
    createdAt = new Date(timestampFromMetadata).toISOString();
  } else {
    createdAt = new Date().toISOString(); // Fallback to current date/time if invalid
  }

  const showTime = metadata.showTime || ""; // Default to empty string if not provided
  const mobileNumberHash = metadata.mobileNumberHash;

  const bookingData = {
    _type: "booking",
    bookingId: bookingId,
    uniqueBookingId: metadata.uniqueBookingId,
    mobileNumber: mobileNumberHash,
    movieName: metadata.movieName || "Unknown",
    theaterName: metadata.theaterName || "Unknown",
    selectedSeats: metadata.selectedSeats
      ? metadata.selectedSeats.split(", ")
      : [],
    showDate: metadata.showDate || "",
    showTime: showTime,
    totalPrice: parseFloat(metadata.totalPrice) || 0,
    createdAt: createdAt,
    ticketStatus: "reserved", // Initial ticket status
  };

  // Send the booking data to the Next.js API route using axios
  try {
    console.log("Creating booking in Sanity:", bookingData);
    const result = await client.create(bookingData);
    console.log("✅ Booking saved to Sanity", result);

    // Update the theater document with the new reserved seats
    const updatedTheater = await updateTheaterWithReservedSeats(metadata);
    console.log("✅ Reserved seats updated in the theater document.");
    
    await axios.post(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/bookingLog`,
      bookingData
    );
    console.log("✅ Booking sent successfully");

    // Save the booking data to Sanity
  } catch (err) {
    console.error("❌ Error processing session:", err);
    throw err;
  }
}

async function updateTheaterWithReservedSeats(metadata) {
  const { theaterName, showDate, selectedSeats, showTime, mobileNumberHash } =
    metadata;

  if (
    !mobileNumberHash ||
    !selectedSeats ||
    !showDate ||
    !showTime ||
    !theaterName
  ) {
    throw new Error("Missing required metadata in session.");
  }

  const theater = await client.fetch(
    `*[_type == "theater" && theaterName == $theaterName][0]`,
    { theaterName }
  );

  if (!theater) {
    throw new Error("❌ Theater not found for the given name.");
  }

  const dateIndex = theater.dates.findIndex((date) => date.date === showDate);
  const movieIndex = theater.dates[dateIndex]?.showMovie.findIndex((movie) =>
    movie.showtimes.some((time) => time.time.trim() === showTime.trim())
  );
  const showtimeIndex = theater.dates[dateIndex]?.showMovie[
    movieIndex
  ]?.showtimes.findIndex((time) => time.time.trim() === showTime.trim());

  if (dateIndex === -1 || movieIndex === -1 || showtimeIndex === -1) {
    throw new Error("❌ Could not locate showtime in theater document.");
  }

  const existingReservedSeats =
    theater.dates[dateIndex].showMovie[movieIndex].showtimes[showtimeIndex]
      .reservedSeats || [];

  const updatedReservedSeats = [
    ...new Set([...existingReservedSeats, ...selectedSeats.split(", ")]),
  ];

  const updatedResponse = await client
    .patch(theater._id)
    .set({
      [`dates[${dateIndex}].showMovie[${movieIndex}].showtimes[${showtimeIndex}].reservedSeats`]:
        updatedReservedSeats,
    })
    .commit();

  return updatedResponse;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const eventId = req.body.id;
    if (!eventId) {
      return res
        .status(400)
        .json({ message: "Event ID missing in request body" });
    }

    try {
      const event = await validateEvent(eventId);
      if (!event) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      if (event.type === "checkout.session.completed") {
        const sessionData = event.data.object;

        // Process the session data directly here
        await processSessionData(sessionData);

        // Respond back after processing the session
        return res
          .status(200)
          .json({ message: "Event processed successfully" });
      }

      return res.status(200).json({ message: "Event type not handled" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    }
  }

  if (req.method === "GET") {
    if (fs.existsSync(sessionFilePath)) {
      const sessionData = fs.readFileSync(sessionFilePath, "utf-8");
      return res.status(200).json(JSON.parse(sessionData));
    } else {
      return res.status(404).json({ message: "No session data available" });
    }
  }

  res.setHeader("Allow", ["POST", "GET"]);
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}