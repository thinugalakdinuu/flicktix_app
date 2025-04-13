import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState();
  const [movieName, setMovieName] = useState()
  const [theaterId, setTheaterId] = useState();
  const [theaterLocation, setTheaterLocation] = useState();
  const [theaterName, setTheaterName] = useState("");
  const [selectedTime, setSelectedTime] = useState();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalQuantities, setTotalQuantities] = useState();
  const [adultQty, setAdultQty] = useState(0);
  const [childrenQty, setChildrenQty] = useState(0);
  const [qty, setQty] = useState(1);
  const [totalPrice, setTotalPrice] = useState();
  const [selected, setSelected] = useState(false);
  const [stripeTheaterId, setStripeTheaterId] = useState("");

  const [uniqueBookingId, setUniqueBookingId] = useState();
    const [phoneNumber, setPhoneNumber] = useState("+");

  useEffect(() => {
    if (selectedDate && theaterName) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [selectedSeats, selectedDate, theaterName]);

  useEffect(() => {
    if (selectedSeats.length === 0) {
      setAdultQty(0);
      setChildrenQty(0);
    } else {
      setAdultQty(selectedSeats.length);
      setChildrenQty(0);
    }
  }, [selectedSeats]);

  const incAdultQty = () => {
    setAdultQty((prevAdultQty) => {
      if (prevAdultQty < selectedSeats.length) {
        return prevAdultQty + 1;
      }
      return prevAdultQty;
    });
    setChildrenQty((prevChildrenQty) => {
      if (prevChildrenQty > 0) {
        return prevChildrenQty - 1;
      }
      return prevChildrenQty;
    });
  };

  const decAdultQty = () => {
    setAdultQty((prevAdultQty) => {
      if (prevAdultQty > 0) {
        return prevAdultQty - 1;
      }
      return prevAdultQty;
    });
    setChildrenQty((prevChildrenQty) => {
      if (prevChildrenQty < selectedSeats.length) {
        return prevChildrenQty + 1;
      }
      return prevChildrenQty;
    });
  };
  const decChildrenQty = () => {
    setChildrenQty((prevChildrenQty) => {
      if (prevChildrenQty > 0) {
        return prevChildrenQty - 1;
      }
      return prevChildrenQty;
    });
    setAdultQty((prevAdultQty) => {
      if (prevAdultQty < selectedSeats.length) {
        return prevAdultQty + 1;
      }
      return prevAdultQty;
    });
  };

  const incChildrenQty = () => {
    setChildrenQty((prevChildrenQty) => {
      if (prevChildrenQty < selectedSeats.length) {
        return prevChildrenQty + 1;
      }
      return prevChildrenQty;
    });
    setAdultQty((prevAdultQty) => {
      if (prevAdultQty > 0) {
        return prevAdultQty - 1;
      }
      return prevAdultQty;
    });
  };

  console.log("Selected Seats:", selectedSeats.length);
  console.log("Adult:", adultQty);
  console.log("Children:", childrenQty);

  return (
    <Context.Provider
      value={{
        setTheaterId,
        setSelectedTime,
        setSelectedDate,
        setTheaterLocation,
        setTheaterName,
        setSelectedSeats,
        setAdultQty,
        setChildrenQty,
        setTotalPrice,
        setStripeTheaterId,
        setMovieName,
        setPhoneNumber,
        theaterId,
        selectedDate,
        selectedTime,
        selectedSeats,
        theaterLocation,
        theaterName,
        totalQuantities,
        totalPrice,
        adultQty,
        childrenQty,
        selected,
        stripeTheaterId,
        movieName,
        incAdultQty,
        decAdultQty,
        incChildrenQty,
        decChildrenQty,
        setUniqueBookingId,
        uniqueBookingId,
        phoneNumber,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
