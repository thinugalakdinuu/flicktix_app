import React, { useState } from "react";
import ReactPlayer from "react-player";
import { urlFor } from "@/lib/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  IoStar,
  IoLanguage,
  IoPlay,
  IoStarHalf,
  IoCloseCircleOutline,
  IoTimeOutline,
} from "react-icons/io5";

const DetailsBanner = ({ details }) => {
  const [open, setOpen] = useState();
  const {
    poster,
    banner,
    name,
    stars,
    duration,
    language,
    categories,
    description,
    trailer,
  } = details;

  const formatDuration = (minutes) => {
    if (!minutes || minutes <= 0) return "Duration not provided";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours} hrs ${mins} mins`;
    } else if (hours > 0 && mins <= 0) {
      return `${hours} hrs`;
    } else {
      return `${mins} mins`;
    }
  };

  return (
    <div className="bg-[#0b090a]">
      <div className="w-full h-[775px] md:h-[525px] lg:h-[725px]">
        <div className="block md:hidden w-full h-[775px] overflow-hidden ">
          <img
            src={urlFor(banner)}
            alt="banner image"
            className="w-full h-[45%] object-cover object-left-top"
          />
          <div className="w-full h-[25%] bg-[#0b090a]"></div>
        </div>
        <div className="hidden md:block w-full md:h-[525px] lg:h-[625px] overflow-hidden">
          <img
            src={urlFor(banner)}
            alt="banner image"
            className="w-full h-[80%] object-cover object-left-top"
          />
          <div className="w-full h-[20%] bg-[#0b090a]"></div>
        </div>

        {/* content */}
        <div className="absolute top-0 left-0 w-full h-full md:h-fit bg-black/50 text-white lg:p-20 lg:pt-[15%] pb-2">
          <div className="md:hidden w-full h-full flex flex-col pt-[100px] items-center justify-center">
            <div className="w-full h-[400px] flex justify-center items-center">
              {/* <div className="h-[85%] aspect-2/3 rounded-2xl overflow-hidden zinc-100 shadow-lg"> */}
              <div className="h-[85%] aspect-2/3 rounded-2xl overflow-hidden shadow-[0_0px_35px_rgba(225,225,225,0.15)]">
                <img
                  src={urlFor(poster)}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full px-5 space-y-4">
              <h1 className="text-4xl pt-2 pb-5 text-left">{name}</h1>
              <div className="w-full flex flex-row justify-start gap-2">
                {stars.map((star, index) => (
                  <span key={index}>
                    {star ? (
                      <IoStar size={18} color="yellow" />
                    ) : (
                      <IoStar size={18} color="#d3d3d3" />
                    )}
                  </span>
                ))}
              </div>
              <div className="w-full flex justify-start">
                {duration && (
                  <div className="w-full flex flex-row justify-start">
                    <IoTimeOutline size={20} />
                    <p className="text-md pl-2">{formatDuration(duration)}</p>
                  </div>
                )}
              </div>
              <div className="w-full flex flex-row justify-start pb-5">
                <IoLanguage size={20} />
                <h1 className="pl-2">{language}</h1>
              </div>
              <div className="w-full h-fit flex flex-wrap gap-2 pb-5 justify-start">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="w-fit h-[30px] flex items-center justify-center p-2 pl-3 pr-3 border text-sm border-[#fff] rounded-full"
                  >
                    {category.toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:flex w-full h-full hidden flex-row items-center justify-start">
            <div className="w-[20%] h-[425px] flex items-center justify-center">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#d3d3d3] hover:bg-[#b8b8b8] w-38 h-12 gap-2 cursor-pointer rounded-xl shadow-md">
                    <IoPlay color="#0b090a" size={20} />
                    <p className="text-[#0b090a] text-sm">Watch trailer</p>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full h-[60%] max-w-2xl border-[#797878] bg-black/50 backdrop-blur-md">
                  <button
                    className="absolute top-4 right-4 rounded-full cursor-pointer outline-none"
                    onClick={() => setOpen(false)}
                  >
                    <IoCloseCircleOutline size={28} className="text-white" />
                  </button>
                  <DialogHeader className="flex items-center justify-center text-white mt-8 overflow-hidden rounded-lg">
                    {open && (
                      <ReactPlayer
                        url={trailer}
                        playing
                        controls
                        width="100%"
                        height="100%"
                      />
                    )}
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <div className="w-[50%] h-[425px] flex flex-col pl-5 lg:pl-10">
              <div className="w-full h-[60%] lg:h-[76%] flex items-end flex-col">
                <div className="h-1/2">
                  <h1 className="text-4xl lg:text-5xl lg:font-bold pt-15 lg:pt-5 text-right">
                    {name}
                  </h1>
                </div>
                <div className="h-1/2 flex flex-col place-content-evenly">
                  <div className="w-full flex flex-row justify-end gap-2">
                    {stars.map((star, index) => (
                      <span key={index}>
                        {star ? (
                          <IoStar size={18} color="yellow" />
                        ) : (
                          <IoStar size={18} color="#d3d3d3" />
                        )}
                      </span>
                    ))}
                  </div>
                  <div className="w-full flex justify-end">
                    {duration && (
                      <p className="text-md">{formatDuration(duration)}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full h-[40%] lg:h-[24%] flex flex-col">
                <div className="w-full flex flex-row justify-end pt-2 pb-9">
                  <IoLanguage size={20} />
                  <h1 className="pl-5">{language}</h1>
                </div>
                <div className="w-full h-fit flex flex-wrap gap-2 justify-end">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="w-fit h-[30px] flex items-center justify-center p-2 pl-3 pr-3 border text-sm border-[#fff] rounded-full"
                    >
                      {category.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-[30%] h-[425px] flex justify-center items-center">
              <div className="h-[80%] lg:h-[95%] aspect-2/3 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={urlFor(poster)}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* description */}

      <div className="w-full min-h-[300px] h-fit flex items-center justify-center">
        <div className="w-[95%] sm:w-[80%] min-h-[200px] h-fit bg-[#1f1d1e] p-5 rounded-md sm:rounded-2xl">
          <p className="text-white">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailsBanner;
