import React, { useState, useEffect, useRef } from "react";
import { client } from "@/lib/client";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import CryptoJS from "crypto-js";
import QRCode from "qrcode";
import { Button } from "./ui/button";

const TicketData = () => {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const { bookingId, data } = router.query;

  const handleDownload = () => {
    const canvas =
      window.innerWidth < 640 ? mobileCanvasRef.current : canvasRef.current;
    if (!canvas) return;

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `${bookingData?.movieName || "ticket"}_${
      bookingData?.uniqueBookingId
    }.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!bookingId) return;

    const fetchBooking = async () => {
      const query = `*[_type == "booking" && uniqueBookingId == "${bookingId}"][0]`;
      try {
        const result = await client.fetch(query);

        if (!result) {
          console.warn("No booking found for ID:", bookingId);
          toast.error(`No booking found for ID: ${bookingId}`, {
            style: {
              borderRadius: "1000px",
              background: "#B03C3F",
              color: "#fff",
            },
          });
          return;
        }
        setTicketId(result._id);
        setBookingData(result);
        console.log("bbok", bookingData);
      } catch (err) {
        console.error("Error fetching booking:", err);
      }
    };

    fetchBooking();
  }, [bookingId]);

  console.log("IDDD", ticketId);

  useEffect(() => {
    if (ticketId) {
      if (!data) {
        toast.error("You don't have access to this page", {
          style: {
            borderRadius: "1000px",
            background: "#B03C3F",
            color: "#fff",
          },
        });
        router.push("/");
      }
      if (data == ticketId) {
        toast.success("Welcome", {
          style: {
            borderRadius: "1000px",
            background: "#F4F6F5",
            color: "#000",
          },
        });
      } else {
        toast.error("You don't have access to this page", {
          style: {
            borderRadius: "1000px",
            background: "#B03C3F",
            color: "#fff",
          },
        });
        router.push("/");
      }
    }
  }, [ticketId, data]);

  const canvasRef = useRef(null);

  useEffect(() => {
    if (!bookingData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const background = new Image();
    background.crossOrigin = "anonymous";
    background.src = "/images/ticket_asset_design_template.svg";

    background.onload = async () => {
      canvas.width = background.width;
      canvas.height = background.height;
      ctx.drawImage(background, 0, 0);

      // TEXT DETAILS
      ctx.fillStyle = "#515151";
      ctx.font = "600 50px Poppins, sans-serif";

      const seats = bookingData.selectedSeats.join(", ");
      const showDateTime = `${bookingData.showDate} at ${bookingData.showTime}`;

      ctx.fillText(`${bookingData.uniqueBookingId}`, 600, 415);
      ctx.fillText(`${bookingData.theaterName}`, 530, 530);
      ctx.fillText(`${bookingData.movieName}`, 485, 650);
      ctx.fillText(seats, 480, 765);
      ctx.fillText(showDateTime, 650, 882);

      // QR CODE
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, bookingData.uniqueBookingId, {
        width: 350,
        margin: 0,
        color: {
          dark: "#ffffff",
          light: "#ffffff00",
        },
      });

      // Draw QR code on ticket
      ctx.drawImage(qrCanvas, 2280, 450); // x=90, y=700 → left side
    };
  }, [bookingData]);

  const mobileCanvasRef = useRef(null);

  useEffect(() => {
    if (!bookingData) return;

    const canvas = mobileCanvasRef.current;
    const ctx = canvas.getContext("2d");

    const background = new Image();
    background.crossOrigin = "anonymous";
    background.src = "/images/ticket_asset_design_template_vertical.svg";

    background.onload = async () => {
      canvas.width = background.width;
      canvas.height = background.height;
      ctx.drawImage(background, 0, 0);

      ctx.fillStyle = "#848484";
      ctx.font = "600 50px Poppins, sans-serif";

      const seats = bookingData.selectedSeats.join(", ");
      const showDateTime = `${bookingData.showDate} at ${bookingData.showTime}`;

      ctx.fillText(`${bookingData.uniqueBookingId}`, 455, 820);
      ctx.fillText(`${bookingData.theaterName}`, 550, 1030);
      ctx.fillText(`${bookingData.movieName}`, 485, 1255);
      ctx.fillText(seats, 455, 1475);
      ctx.fillText(showDateTime, 340, 1700);

      // QR CODE
      const qrCanvas = document.createElement("canvas");
      await QRCode.toCanvas(qrCanvas, bookingData.uniqueBookingId, {
        width: 350,
        margin: 0,
        color: {
          dark: "#ffffff",
          light: "#ffffff00",
        },
      });

      // Draw QR code on ticket
      ctx.drawImage(qrCanvas, 465, 2350); // x=90, y=700 → left side
    };
  }, [bookingData]);

  return (
    <>
      <div className="w-full h-auto">
        <img
          src="/images/ticket-background.png"
          alt="ticket-background"
          className="w-full h-[200vh] sm:h-dvh lg:h-screen object-cover"
        />
      </div>
      <div className="absolute top-0 left-0 flex flex-col items-center justify-center min-h-screen gap-4 p-6">
        <canvas
          ref={canvasRef}
          className="hidden sm:block h-auto w-full lg:w-4/5 shadow-lg"
        />
        <canvas
          ref={mobileCanvasRef}
          className="block sm:hidden w-[85%] h-auto"
        />

        <Button
          onClick={handleDownload}
          className="mt-4 px-5 py-6 bg-[#333132] hover:bg-[#292728] text-white rounded-lg shadow-lg cursor-pointer transition"
        >
          Download Ticket
        </Button>
      </div>
    </>
  );
};

export default TicketData;
