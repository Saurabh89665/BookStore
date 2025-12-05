import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard/BookCard";

const Allbooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/get-all-book"
        );

        // इथे पूर्ण response बघ
        console.log("API raw response:", response.data);

        // इथे फक्त books array बघ
        console.log("Books array:", response.data.data);

        setBooks(response.data.data || []);
      } catch (error) {
        console.log("Error fetching all books:", error.response || error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="w-full bg-black text-white mt-3">
      <div className="max-w-[95%] mx-auto px-2 py-10">
        
        {/* Heading */}
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-300 text-transparent bg-clip-text mb-2">
          All Books
        </h1>
        <p className="text-sm text-zinc-400 mb-6">
          Browse all available books from our collection 📚
        </p>

        {/* Books Grid */}
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((item, index) => (
              <BookCard key={item._id || index} data={item} />
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 text-sm mt-6">
            No books found. Please add some books.
          </p>
        )}
      </div>
    </div>
  );
};

export default Allbooks;
