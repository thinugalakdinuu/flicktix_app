import React from "react";

import { client } from "@/lib/client";
import DetailsBanner from "@/components/DetailsBanner";
import AvailableTheater from "@/components/AvailableTheater";

const MovieDetails = ({ movieData, theaterData }) => {  
  return (
    <div className="bg-[#0b090a]">
      <DetailsBanner details={movieData} />
      <div className="w-full min-h-[400px] sm:min-h-[500px] h-fit md:p-15">
        <h1 className="text-3xl font-semibold mb-15 pl-5 text-white">RESERVE TICKETS</h1>
      <AvailableTheater theaterDetails={theaterData} movieDetails={movieData} />

      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  const query = `*[_type == "movie"] {
        slug {
            current
        }
    }
    `;

  const movies = await client.fetch(query);

  const paths = movies.map((movie) => ({
    params: {
      slug: movie.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const query = `*[_type == "movie" && slug.current == '${slug}'][0]`;

  const movieData = await client.fetch(query);

  const bannerQuery = '*[_type == "banner"]{ ..., movieSelect-> }';
  const bannerData = await client.fetch(bannerQuery);

  const theaterQuery = `*[_type == "theater"]{
    _id,
    theaterName,
    location,
    dates[] {
      date,
      showMovie[] {
        movieName->{
          _id,
          name,
          trailer,
          slug,
          description
        },
        showtimes[] {
          time,
          reservedSeats,
          availableSeats
        }
      }
    }
  }`;  
  const theaterData = await client.fetch(theaterQuery);

  return {
    props: { movieData, bannerData, theaterData },
  };
};

export default MovieDetails;