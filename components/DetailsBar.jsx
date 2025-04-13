import React from "react";
import { format } from "date-fns";
import { IoCalendarOutline, IoTimeOutline, IoLocationOutline  } from "react-icons/io5";

import { useStateContext } from "@/context/StateContext";

const DetailsBar = () => {
  const { selectedDate, selectedTime, theaterName } = useStateContext();

  const formattedDate = selectedDate
    ? format(new Date(selectedDate), "dd MMM")
    : "Not Selected";

  return (
    <div className="w-full h-fit sm:h-[100px] @min-xs:p-20 gap-2 md:gap-10 flex items-center justify-center flex-wrap md:flex-row">
      <div className="w-[100px] sm:w-[20%] lg:w-[10%] h-[50px] bg-[#1f1d1e] rounded-lg">
        {selectedDate
        ? (
            <div className="w-full h-full flex items-center justify-center gap-2">
                <IoCalendarOutline size={20} color="white" />
                <p className="text-sm text-white">{formattedDate}</p>
            </div>
        ) : (
            <div className="w-full h-full flex items-center justify-center gap-2">
                <p className="text-sm text-white">{formattedDate}</p>
            </div>
        )}
      </div>
      <div className="w-[120px] sm:w-[24%] lg:w-[12%] h-[50px] bg-[#1f1d1e] rounded-lg">
        {selectedTime
        ? (
            <div className="w-full h-full flex items-center justify-center gap-2">
                <IoTimeOutline size={20} color="white" />
                <p className="text-sm text-white">{selectedTime}</p>
            </div>
        )
        : (
            <div className="w-full h-full flex items-center justify-center gap-2">
                <p className="text-sm text-white">Not Selected</p>
            </div>
        )}
      </div>
      <div className="w-[227px] sm:w-[35%] lg:w-[30%] h-[50px] bg-[#1f1d1e] rounded-lg">
        {theaterName
        ? (
            <div className="w-full h-full flex items-center justify-center gap-2">
                <IoLocationOutline size={20} color="white" />
                <p className="text-sm text-white">{theaterName}</p>
            </div>
        )
        : (
            <div className="w-full h-full flex items-center justify-center gap-2">
                <p className="text-sm text-white">Not Selected</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default DetailsBar;
