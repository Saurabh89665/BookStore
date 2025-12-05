import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="w-screen h-auto lg:h-[80vh] bg-gradient-to-r from-black via-gray-900 to-black text-white flex flex-col lg:flex-row items-center justify-between mt-6">

      {/* LEFT SECTION */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left py-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-emerald-400 leading-tight mx-4 lg:mx-8">
          Discover Your Next Great Read
        </h1>

        <p className="mt-5 text-lg sm:text-xl text-gray-300 leading-relaxed mx-4 lg:mx-8">
          Explore captivating stories, expand your knowledge, and get inspired with our curated selection of books.
        </p>

        <div className="mt-7">
          <Link to="/all-books" className="bg-emerald-500 text-black font-semibold px-9 py-3 mx-5  rounded-lg hover:bg-emerald-400 hover:scale-105 transition-all duration-300 shadow-lg">
            📚 Browse Books
          </Link>
        </div>
      </div>

      {/* RIGHT SECTION IMAGE */}
      <div className="w-full lg:w-1/2 flex justify-center items-center bg-gradient-to-l from-transparent to-gray-800">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2602/2602555.png"
          alt="Books"
          className="w-[260px] sm:w-[320px] lg:w-[500px] object-contain drop-shadow-[0px_0px_25px_rgba(0,255,150,0.5)]"
        />
      </div>

    </section>
  );
};

export default Hero;
