import React from "react";
import { urlFor } from "@/lib/client";

import { IoLanguage, IoTimeOutline, IoStar } from "react-icons/io5";

const MovieSummary = ({ movieDetails }) => {
  const { poster, name, language, duration, stars, categories } = movieDetails;

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
    <div>
      <div className="relative w-full h-[150vh] pt-10 sm:pt-0 sm:h-[100vh]">
        <div className="w-full h-full overflow-hidden flex items-center justify-center">
          <img
            src={urlFor(poster)}
            alt="banner image"
            className="w-[50%] object-cover mb-[60%] origin-bottom -rotate-12"
          />
        </div>

        <div className="absolute top-0 left-0 w-full h-full flex flex-col sm:flex-row items-center justify-start backdrop-blur-[200px] text-white p-5 sm:px-5 lg:px-20 pt-[20%] sm:pt-[10%] pb-[5%]">
          <div className="w-[90%] md:w-[50%] h-fit sm:h-full sm:w-[50%] flex items-center justify-center mb-4 sm:mb-0">
            <div>
              <img
                src={urlFor(poster)}
                alt="poster"
                className="w-[280px] rounded-2xl shadow-2xl"
              />
            </div>
          </div>
          <div className="w-[90%] md:w-[50%] h-fit sm:h-full sm:w-[50%] p-2 flex items-start sm:items-center justify-center lg:flex-none lg:p-12">
            <div className="pt-10 sm:pt-0 w-[90%] lg:w-full h-fit lg:h-full">
              <h1 className="text-4xl font-medium">{name}</h1>

              <span className="flex flex-row gap-2 pt-10">
                <IoLanguage size={20} />
                {language}
              </span>
              <span className="flex flex-row gap-2 pt-3">
                <IoTimeOutline size={20} />
                {duration && (
                  <p className="text-md">{formatDuration(duration)}</p>
                )}
              </span>

              <div className="w-full flex flex-row justify-start pt-10 gap-2">
                {stars.map((star, index) => (
                  <span key={index}>{star ? <IoStar size={18} color="yellow" /> : <IoStar size={18} color="#d3d3d3" />}</span>
                ))}
              </div>
              
              <div className="w-full h-fit flex flex-wrap gap-2 justify-start pt-10">
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
        </div>
      </div>
    </div>
  );
};

export default MovieSummary;
