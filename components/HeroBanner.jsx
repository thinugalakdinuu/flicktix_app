import React, { useState } from "react";

import ReactPlayer from "react-player";
import Link from "next/link";
import { urlFor } from "@/lib/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoPlay, IoInformationCircle, IoCloseCircleOutline } from "react-icons/io5";

const HeroBanner = ({ heroBanner }) => {
  const [open, setOpen] = useState();

  const trailer = heroBanner.movieSelect.trailer
  
  return (
    <div className="relative w-full h-[100vh]">
      <div className="w-full h-full overflow-hidden">
        <img
          src={urlFor(heroBanner.image)}
          alt="banner image"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/50 text-white p-5 sm:p-20 sm:pt-[15%]">
        <div className="w-full h-fit sm:h-2/13 flex items-center">
          <h1 className="text-6xl font-black">{heroBanner.movie}</h1>
        </div>
        <div className="w-full h-fit sm:h-1/13 pl-1 pt-10 flex items-center">
          <p className="">{heroBanner.midText}</p>
        </div>
        <div className="w-full h-fit sm:h-2/13 flex flex-wrap mt-[10%] gap-5">
          <div className="flex items-center pl-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#ba181b] hover:bg-[#ab1619] w-38 h-12 gap-2 cursor-pointer rounded-xl shadow-md">
                  <IoPlay color="white" size={20} />
                  <p className="text-white text-sm">Watch trailer</p>
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
            {/* <Button className="bg-[#ba181b] hover:bg-[#ab1619] w-38 h-12 gap-2 cursor-pointer rounded-xl shadow-md">
              <IoPlay color="white" size={20} />
              <p className="text-white text-sm">Watch trailer</p>
            </Button> */}
          </div>
          <div className="flex items-center">
            <Link href={`/movie/${heroBanner.movieSelect._id}`}>
              <Button className="bg-[#d3d3d3] hover:bg-[#b8b8b8] w-38 h-12 gap-2 cursor-pointer rounded-xl shadow-md">
                <IoInformationCircle color="#0b090a" size={20} />
                <p className="text-[#0b090a] text-sm">More info</p>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
