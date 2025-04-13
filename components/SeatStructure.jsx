import React, { useState, useEffect } from "react";
import { useStateContext } from "@/context/StateContext";

// import { urlFor } from "@/lib/client";

const rows = "ABCDEFGHIJ".split("");
const cols = Array.from({ length: 20 }, (_, i) => i + 1);

const SeatStructure = ({ theaterDetails }) => {
  const { setSelectedSeats, theaterId, selectedSeats, setStripeTheaterId } = useStateContext();

  const theater = theaterDetails.find((t) => t._id === theaterId);
  const reservedSeats =
    theater?.dates.flatMap((date) =>
      date.showMovie.flatMap((movie) =>
        movie.showtimes.flatMap((showtime) => showtime.reservedSeats || [])
      )
    ) || [];

    useEffect(() => {
      setStripeTheaterId(theater?.stripeAccountId);
    }, [])
    

    // console.log(theater?.stripeAccountId)

  console.log("Reserved Seats:", reservedSeats);

  const [seats, setSeats] = useState(
    rows.flatMap((row) =>
      cols.map((col) => ({
        id: `${row}${col}`,
        status: reservedSeats.includes(`${row}${col}`)
          ? "reserved"
          : "available",
      }))
    )
  );

  const toggleSeat = (id) => {
    setSeats((prevSeats) => {
      const updatedSeats = prevSeats.map((seat) =>
        seat.id === id && seat.status !== "reserved"
          ? {
              ...seat,
              status: seat.status === "selected" ? "available" : "selected",
            }
          : seat
      );
  
      // Get selected seat IDs
      const selectSeats = updatedSeats
        .filter((seat) => seat.status === "selected")
        .map((seat) => seat.id);
  
      // Update global selectedSeats state
      setSelectedSeats(selectSeats);
  
      return updatedSeats;
    });
  };
  
  // Log selected seats when they change
  useEffect(() => {
    console.log("Selected Seats:", selectedSeats);
  }, [selectedSeats]);
  

  return (
    <div className="w-full h-[750px] flex justify-center items-center relative">
      {/* First Div - Background Layer */}
      <div className="w-[full] lg:w-[1000px] h-[660px] sm:h-[650px] flex flex-col items-center justify-center absolute inset-0 m-auto z-0 rounded-none sm:rounded-[30px]">
        <div className="w-full h-full relative overflow-hidden">
          <div className="w-[400px] h-[400px] absolute top-[-100px] left-[-100px] border-[25px] border-[#A4BBEF] rounded-full"></div>
          <div className="w-[400px] h-[400px] absolute bottom-[-100px] right-[-100px] border-[55px] border-[#A4BBEF] rounded-full"></div>
        </div>
      </div>

      {/* Second Div - Transparent Layer */}
      <div className="w-[full] lg:w-[1000px] h-[660px] sm:h-[650px] absolute inset-0 flex justify-center items-center rounded-none sm:rounded-[30px] bg-[#d3d3d3]/2 backdrop-blur-[200px] z-10 m-auto">
        <div className="w-full h-full px-0 sm:px-[20px] lg:px-[40px] rounded-[30px]">
          <div className="w-full h-[160px] flex justify-center">
            <img
              src={`/images/theater-screen.png`}
              onContextMenu={(e) => e.preventDefault()}
              draggable="false"
              alt="theater screen"
              className="w-full pointer-events-none"
            />
          </div>
          <div className="w-full h-[330px] flex flex-row items-center justify-center">
            <div className="w-[20px] sm:w-1/20 lg:w-[85px] h-full flex sm:justify-end justify-center p-0 sm:pr-2 lg:pr-5">
              <div className="w-fit h-full flex flex-col items-start justify-center gap-[10px]">
                {"ABCDEFGHIJ".split("").map((letter) => (
                  <p key={letter} className="text-md font-sans text-white">
                    {letter}
                  </p>
                ))}
              </div>
            </div>
            <div className="w-9/10 lg:w-[790px] h-full flex flex-col items-center overflow-x-scroll">
              <div
                className="w-full h-full grid grid-cols-20 gap-2 gap-y-3"
                style={{
                  gridTemplateColumns:
                    "repeat(4, 1fr) 100px repeat(9, 1fr) 100px repeat(5, 1fr)",
                }}
              >
                {seats.map((seat) => (
                  <button
                    key={seat.id}
                    className={`w-[22px] h-[22px] rounded-sm ${
                      seat.status === "reserved"
                        ? "bg-[#0B090A] cursor-default"
                        : seat.status === "selected"
                        ? "bg-[#A4BBEF] cursor-pointer"
                        : "bg-gray-600 cursor-pointer"
                    }`}
                    onClick={() =>
                      seat.status !== "reserved" && toggleSeat(seat.id)
                    }
                    disabled={seat.status === "reserved"}
                  />
                ))}
              </div>
            </div>
            <div className="w-[20px] sm:w-1/20 lg:w-[85px] h-full flex sm:justify-start justify-center p-0 sm:pl-2 lg:pl-5">
              <div className="w-fit h-full flex flex-col items-start justify-center gap-[10px]">
                {"ABCDEFGHIJ".split("").map((letter) => (
                  <p key={letter} className="text-md font-sans text-white">
                    {letter}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full h-[110px] sm:h-[160px] flex flex-wrap md:flex-row justify-center items-center sm:items-start pt-2 sm:pt-15 gap-2">
            <div className="w-[150px] h-[30px] flex items-center justify-center gap-5">
              <div className="w-[20px] h-[20px] rounded-sm bg-[#0B090A]" />
              <p className="text-white">Reserved</p>
            </div>
            <div className="w-[150px] h-[30px] flex items-center justify-center gap-5">
              <div className="w-[20px] h-[20px] rounded-sm bg-gray-600" />
              <p className="text-white">Available</p>
            </div>
            <div className="w-[150px] h-[30px] flex items-center justify-center gap-5">
              <div className="w-[20px] h-[20px] rounded-sm bg-[#A4BBEF]" />
              <p className="text-white">Selected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatStructure;
