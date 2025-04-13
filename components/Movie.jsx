import React from "react";
import Link from "next/link";

import { urlFor } from "@/lib/client";

const Movie = ({ movie: { poster, slug, name } }) => {
  
  return (
    <div className="w-full md:w-[200px]">
      <div className="md:hidden flex items-center justify-center w-full h-[200px]">
        <Link href={`/movie/${slug.current}`} className="w-[95%] h-[95%] bg-[#141213]">
          <div className="w-full h-full flex flex-row items-center pb-3 justify-center border-b border-white">
            <div className="w-fit h-full">
              <img src={urlFor(poster)} alt="poster" className="h-full shadow-[0_8px_10px_rgba(225,225,225,0.2)]" />
            </div>
            <div className="w-[55%] h-full p-5">
              <h1 className="text-2xl text-white">{name}</h1>
            </div>
          </div>
        </Link>
      </div>
      <div className="w-[200px] h-fit hidden md:block rounded-2xl overflow-hidden relative group transition-all duration-500 shadow-[0_0px_35px_rgba(225,225,225,0.05)] hover:shadow-[0_0px_35px_rgba(225,225,225,0.15)]">
        <Link href={`/movie/${slug.current}`}>
          <div className="relative w-full h-[300px]">
            <img
              src={urlFor(poster)}
              alt="movie poster"
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out flex items-end p-3">
              <h1 className="text-white text-lg font-semibold">{name}</h1>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Movie;
