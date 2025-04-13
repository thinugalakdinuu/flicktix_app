import React, { useEffect, useState, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Link from "next/link";
import { client, urlFor } from "@/lib/client";

const Navbar = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "movie"]{ name, slug, poster }`
        );
        setAllMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const results = allMovies.filter(
        (movie) =>
          movie.name &&
          movie.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMovies(results);
      setShowDropdown(true);
    } else {
      setFilteredMovies([]);
      setShowDropdown(false);
    }
  }, [searchTerm, allMovies]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full h-15 flex flex-row bg-[#0b090a]/40 backdrop-blur-md">
      <div className="w-1/2 h-full pl-5">
        <Link href={"/"} className="w-fit h-full flex items-center">
          <img
            src="/images/same_size_image_logo.png"
            alt="logo"
            className="h-[50%] w-auto"
          />
        </Link>
      </div>

      <div className="w-1/2 h-full flex flex-row items-center justify-around">
        <div ref={inputRef} className="w-full sm:w-3/5 relative">
          <div className="w-full flex items-center gap-2 bg-[#333132] hover:bg-[#2c2a2b] border-2 border-[#D3D3D3] rounded-2xl px-4 py-2">
            <IoSearchOutline color="#D3D3D3" size={20} />
            <input
              type="text"
              placeholder="Search movies..."
              className="bg-transparent outline-none border-none text-[#D3D3D3] placeholder:text-[#D3D3D3] w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm && setShowDropdown(true)}
            />
          </div>

          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 w-full sm:min-w-[300px] bg-[#1e1e1e] border border-[#333] rounded-xl p-2 max-h-60 overflow-y-auto z-50">
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <Link
                    key={movie.slug.current}
                    href={`/movies/${movie.slug.current}`}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-[#F5F3F4] hover:bg-[#333] rounded-lg"
                    onClick={() => {
                      setShowDropdown(false);
                      setSearchTerm("");
                    }}
                  >
                    {movie.poster && (
                      <img
                        src={urlFor(movie.poster).width(40).height(60).url()}
                        alt={movie.name}
                        className="w-10 h-15 object-cover rounded-md"
                      />
                    )}
                    <span className="truncate">{movie.name}</span>
                  </Link>
                ))
              ) : (
                <p className="text-[#F5F3F4] text-sm px-3 py-2">
                  No results found
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
