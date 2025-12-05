import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ data }) => {
  if (!data) return null;

  return (
    <Link 
      to={`/view-book-details/${data._id}`} 
      className="block"
    >
      <div className="flex gap-3 rounded-xl bg-zinc-900 border border-zinc-700 shadow-md 
      hover:shadow-emerald-500/30 hover:border-emerald-400 transition-all duration-300 
      hover:-translate-y-1 p-3 h-40 overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="w-24 h-full bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
          <img
            src={data.url}
            alt={data.title}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.src = "https://cdn-icons-png.flaticon.com/512/3145/3145765.png";
            }}
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex flex-col justify-between flex-1 overflow-hidden">

          {/* Title */}
          <h2 className="text-base font-semibold text-white truncate">
            {data.title}
          </h2>

          {/* Author */}
          <p className="text-xs text-zinc-400 truncate">
            by <span className="text-emerald-300">{data.author}</span>
          </p>

          {/* Language + Price */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] px-2 py-[2px] rounded-full bg-zinc-800 text-zinc-300 whitespace-nowrap">
              {data.language}
            </span>

            <span className="text-emerald-400 font-bold text-sm">
              ₹{data.price}
            </span>
          </div>

          {/* Description Truncated */}
          <p className="text-[11px] text-zinc-500 line-clamp-2 overflow-hidden">
            {data.desc}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
