import React, { useEffect, useState } from "react";
import { client } from "@/lib/client";
import Link from "next/link";

import MoviesComponent from "@/components/MoviesComponent";
import Movie from "@/components/Movie";

import { Button } from "@/components/ui/button";

const movies = () => {
  const [moviesList, setMoviesList] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await client.fetch(`*[_type == "movie"]`);
        setMoviesList(data);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="mb-15 pt-20 px-5 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
        <h1 className="md:pl-10 text-3xl font-semibold text-white">Movies</h1>
      </div>

      {/* Desktop */}
      <div className="hidden w-full h-fit md:flex flex-wrap justify-center gap-16 pt-5">
        {moviesList?.map((movie) =>
          movie?.slug?.current ? (
            <Movie key={movie.slug.current} movie={movie} />
          ) : null
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden w-full h-fit flex flex-col items-start justify-start gap-5 pt-10">
        {moviesList?.map((movie) =>
          movie?.slug?.current ? (
            <Movie key={movie.slug.current} movie={movie} />
          ) : null
        )}
      </div>
    </div>
  );
};

export default movies;
