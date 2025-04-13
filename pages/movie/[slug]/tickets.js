import React, { useEffect } from "react";
import { client } from "@/lib/client";
import { useRouter } from "next/router";
import MovieSummary from "@/components/MovieSummary";
import DetailsBar from "@/components/DetailsBar";
import SeatStructure from "@/components/SeatStructure";
import BookingSummary from "@/components/BookingSummary";
import { useStateContext } from "@/context/StateContext";



const MovieTickets = ({ movieData, theaterData }) => {
  const { selected } = useStateContext();
  
  const router = useRouter();

  useEffect(() => {
    if(!selected) {
      router.replace('/')
    }
  }, [])

  return (
    <div>
      <MovieSummary movieDetails={movieData} />
      <DetailsBar movieDetails={movieData} />
      <SeatStructure theaterDetails={theaterData} />
      <BookingSummary theaterDetails={theaterData} movieDetails={movieData} />
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
    stripeAccountId,
    pricing {
      adultPrice,
      childPrice
    },
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
          reservedSeats
        }
      }
    }
  }`;
  const theaterData = await client.fetch(theaterQuery);

  return {
    props: { movieData, bannerData, theaterData },
  };
};

export default MovieTickets;
