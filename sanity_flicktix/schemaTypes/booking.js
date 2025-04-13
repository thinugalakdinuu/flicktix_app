export default {
    name: "booking",
    title: "Bookings",
    type: "document",
    fields: [
      {
        name: "bookingId",
        title: "Booking ID",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "uniqueBookingId",
        title: "Unique ID",
        type: "string",
        validation: (Rule) => Rule.required(),
      },
      {
        name: "mobileNumber",
        title: "Mobile Number(encrypted)",
        type: "string",
      },
      {
        name: "movieName",
        title: "Movie Name",
        type: "string",
      },
      {
        name: "theaterName",
        title: "Theater Name",
        type: "string",
      },
      {
        name: "selectedSeats",
        title: "Selected Seats",
        type: "array",
        of: [{ type: "string" }],
      },
      {
        name: "showDate",
        title: "Show Date",
        type: "string",
        description: "Date of the movie show (YYYY-MM-DD)",
      },
      {
        name: "showTime",
        title: "Show Time",
        type: "string",
        description: "Time of the movie show (HH:MM AM/PM)",
      },
      {
        name: "totalPrice",
        title: "Total Price",
        type: "number",
      },
      {
        name: "createdAt",
        title: "Created At",
        type: "datetime",
      },
      {
        name: "ticketStatus",
        title: "Ticket Status",
        type: "string",
      },
    ],
  };
  