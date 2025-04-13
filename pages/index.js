import React from "react";

import { client } from "@/lib/client";

import "../styles/globals.css";

import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import Movie from "@/components/Movie";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Home = ({
  movieData,
  bannerData,
  editorsChoiceData,
  topPicksData,
}) => {
  // Extract movies from Editors' Choice and Top Picks
  const editorsChoiceMovies = editorsChoiceData
    ?.flatMap((pick) => pick.movieSelect)
    .slice(0, 10); // Limit to 10 movies

  const topPicksMovies = topPicksData
    ?.flatMap((pick) => pick.movieSelect)
    .slice(0, 10); // Limit to 10 movies

  return (
    <>
      <div className="h-full relative">
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
        <HeroBanner heroBanner={bannerData.length && bannerData[0]} />

        {/* TOP PICKS */}
        <div className="mb-15 pt-20 px-5 flex flex-flex place-content-between">
          <h1 className="text-3xl font-semibold text-white">TOP PICKS</h1>
          <Link href={`/movies`}>
            <Button className="text-white text-sm cursor-pointer hover:ring ring-[#797878]">
              view more
            </Button>
          </Link>
        </div>
        <div className="hidden w-full h-fit md:flex flex-wrap justify-center gap-16 pt-5">
          {topPicksMovies?.map((movie) =>
            movie?.slug?.current ? (
              <Movie key={movie.slug.current} movie={movie} />
            ) : null // Skips movies without a slug
          )}
        </div>
        <div className="md:hidden w-full h-fit flex flex-col items-start justify-start gap-0 sm:gap-5 pt-10">
          {topPicksMovies?.map((movie) =>
            movie?.slug?.current ? (
              <Movie key={movie.slug.current} movie={movie} />
            ) : null // Skips movies without a slug
          )}
        </div>

        {/* EDITORS CHOICE */}
        <div className="mb-15 pt-20 px-5 flex flex-flex place-content-between">
          <h1 className="text-3xl font-semibold text-white">EDITOR&apos;S CHOICE</h1>
          <Link href={`/movies`}>
            <Button className="text-white text-sm cursor-pointer hover:ring ring-[#797878]">
              view more
            </Button>
          </Link>
        </div>
        <div className="hidden w-full h-fit md:flex flex-wrap justify-center gap-16 pt-5">
          {editorsChoiceMovies?.map((movie) => (
            <Movie key={movie.slug.current} movie={movie} />
          ))}
        </div>
        <div className="md:hidden w-full h-fit flex flex-col items-start justify-start gap-0 sm:gap-5 pt-10 pb-10">
          {editorsChoiceMovies?.map((movie) => (
            <Movie key={movie.slug.current} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const query = '*[_type == "movie"]';
  const movieData = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]{ ..., movieSelect-> }';
  const bannerData = await client.fetch(bannerQuery);

  const editorsChoicequery =
    '*[_type == "editorsChoice"]{ ..., movieSelect[]-> }';
  const editorsChoiceData = await client.fetch(editorsChoicequery);

  const topPicksquery = '*[_type == "topPicks"]{ ..., movieSelect[]-> }';
  const topPicksData = await client.fetch(topPicksquery);

  return {
    props: { movieData, bannerData, editorsChoiceData, topPicksData },
  };
};

export default Home;
