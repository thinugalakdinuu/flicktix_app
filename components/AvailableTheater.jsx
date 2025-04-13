import React, { useState, useRef, useEffect } from "react";
import { format, addDays } from "date-fns";
import { useStateContext } from "@/context/StateContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  IoChevronBackOutline,
  IoChevronForward,
  IoFilmOutline,
} from "react-icons/io5";
import Link from "next/link";

const AvailableTheater = ({ theaterDetails, movieDetails }) => {
  const currentSlug = movieDetails.slug.current;

  const [selectedDay, setSelectedDay] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const {
    setTheaterId,
    setSelectedTime,
    setSelectedDate,
    setTheaterName,
    setMovieName,
    theaterId,
    selectedTime,
    selectedDate,
    theaterName,
  } = useStateContext();

  const handleDaySelection = (day) => {
    setSelectedDay(day);
  };

  useEffect(() => {
    if (selectedDate) {
      console.log("Selected day updated:", selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTime) {
      console.log("Selected time:", selectedTime);
    }
  }, [selectedTime]);

  const scrollRef = useRef(null);
  const nextDays = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const filteredTheaters = Array.isArray(theaterDetails)
    ? theaterDetails
        .map((theater) => {
          const matchingDates = theater.dates?.filter(
            (dateObj) =>
              dateObj.date === selectedDay &&
              dateObj.showMovie.some(
                (movie) => movie.movieName.slug.current === currentSlug
              )
          );

          if (!matchingDates || matchingDates.length === 0) return null;

          return {
            theaterId: theater._id,
            theaterName: theater.theaterName,
            theaterLocation: theater.location,
            times: matchingDates.flatMap((dateObj) =>
              dateObj.showMovie.flatMap(
                (movie) => movie.showtimes.map((showtime) => showtime.time)
              )
            ),
            movieNameJson: matchingDates.flatMap((dateObj) =>
              dateObj.showMovie.flatMap((movie) => movie.movieName.name)
            )[0],
          };
        })
        .filter(Boolean)
    : [];

  return (
    <div>
      {/* Date Navigation */}
      <div className="w-full h-[72px] flex flex-row items-center sm:pb-10">
        <div className="w-[10%] h-full md:h-[90%] flex items-center justify-center">
          <div className="w-[7vw] sm:w-[4vw] h-[7vw] sm:h-[4vw] rounded-full flex items-center justify-center ring ring-[#797878] hover:bg-[#797878] bg-[#1F1D1E] overflow-hidden">
            <Button
              className="w-full h-full cursor-pointer"
              onClick={scrollLeft}
            >
              <IoChevronBackOutline color="white" size={25} />
            </Button>
          </div>
        </div>
        <div className="w-[80%] h-[72px] flex flex-col justify-center items-center">
          <div className="w-full overflow-x-auto" ref={scrollRef}>
            <div className="flex justify-center gap-x-10 w-max px-6 py-2 md:py-0">
              {nextDays.map((date) => {
                const formattedDate = format(date, "yyyy-MM-dd");
                return (
                  <Button
                    key={formattedDate}
                    onClick={() => setSelectedDay(formattedDate)}
                    className={`w-[60px] h-[60px] aspect-square p-[2.5vw] rounded-md sm:rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center ${
                      selectedDay === formattedDate
                        ? "bg-[#d3d3d3] text-[#0b090a] hover:bg-[#d3d3d3]"
                        : "bg-[#333132] hover:bg-[#333132]"
                    }`}
                  >
                    <p className="text-xs">{format(date, "MMM")}</p>
                    <p className="text-2xl">{format(date, "d")}</p>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-[10%] h-full flex items-center justify-center">
          <div className="w-[7vw] sm:w-[4vw] sm:h-[4vw] rounded-full flex items-center justify-center ring ring-[#797878] hover:bg-[#797878] bg-[#1F1D1E] overflow-hidden">
            <Button
              className="w-full h-full cursor-pointer"
              onClick={scrollRight}
            >
              <IoChevronForward color="white" size={25} />
            </Button>
          </div>
        </div>
      </div>

      {/* Card */}
      <div>
        <div>
          {filteredTheaters.length > 0 ? (
            filteredTheaters.map((theater, index) => (
              <Card
                key={index}
                className="p-2 sm:p-4 py-5 rounded-none shadow-none flex items-center bg-[#0b090a] border-none"
              >
                <CardContent className="bg-[#1f1d1e] w-full sm:w-[80%] py-3 sm:py-10 rounded-2xl">
                  <div className="w-full h-fit flex flex-row gap-2 sm:gap-7">
                    <div className="h-full">
                      <div className="w-[45px] sm:w-[65px] h-[45px] sm:h-[65px] border-2 sm:border-3 border-white flex items-center justify-center rounded-full">
                        <IoFilmOutline
                          className="hidden sm:block"
                          size={40}
                          color="white"
                        />
                        <IoFilmOutline
                          className="block sm:hidden"
                          size={25}
                          color="white"
                        />
                      </div>
                    </div>
                    <div className="h-full sm:py-1">
                      <h3 className="text-lg font-semibold text-white">
                        {theater.theaterName}
                      </h3>
                      <p className="text-[#d3d3d3]">
                        {theater.theaterLocation}
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-fit flex items-center justify-center pt-5">
                    <div className="w-full sm:w-[90%] h-fit flex flex-wrap gap-10 mt-2 p-2 sm:p-4">
                      {theater.times.length > 0 ? (
                        theater.times.map((time, i) => (
                          <Link href={`/movie/${currentSlug}/tickets`} key={i}>
                            <Button
                              onClick={() => {
                                setSelectedTime(time);
                                setTheaterName(theater.theaterName);
                                setSelectedDate(selectedDay);
                                setTheaterId(theater.theaterId);
                                setMovieName(theater.movieNameJson);
                              }}
                              className="bg-[#333132] hover:bg-[#292728] cursor-pointer text-[#D3D3D3] border sm:border-2 border-[#D3D3D3] px-2 sm:px-5 py-3 sm:py-6 rounded-lg"
                            >
                              <p className="text-sm sm:text-lg font-mono">
                                {time} {/* Display the time string */}
                              </p>
                            </Button>
                          </Link>
                        ))
                      ) : (
                        <p className="text-gray-500">No showtimes available</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="w-full h-[250px] flex items-center justify-center p-2 sm:p-4 py-5 ">
              <div className="bg-[#1f1d1e] w-full h-full sm:w-[80%] flex items-center justify-center py-3 sm:py-10 rounded-2xl">
                <p className="text-gray-100 text-md">
                  No theaters available for the selected date.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableTheater;
