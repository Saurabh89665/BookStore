// src/pages/Favourite.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard"; // adjust path if needed
import { FiTrash2 } from "react-icons/fi";

const Favourite = () => {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id") || localStorage.getItem("userId");
  const isLoggedIn = !!token && !!userId;

  const buildHeaders = (bookid) => ({ id: userId, bookid, Authorization: `Bearer ${token}` });

  // helper: dedupe by _id (server might sometimes return duplicates)
  const uniqueById = (arr) => {
    const map = new Map();
    for (const item of arr || []) {
      const key = item && (item._id ?? item).toString();
      if (!map.has(key)) map.set(key, item);
    }
    return Array.from(map.values());
  };

  const fetchFavs = useCallback(async () => {
    if (!isLoggedIn) {
      setFavs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const headers = { id: userId, Authorization: `Bearer ${token}` };
      const res = await axios.get("http://localhost:1000/api/v1/get-favourite-book", { headers });
      const books = res.data?.data ?? [];
      setFavs(uniqueById(books));
    } catch (err) {
      console.error("Fetch favourites error:", err);
      setError("Failed to load favourites. Try again.");
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, token, userId]);

  useEffect(() => {
    fetchFavs();

    const onFavsChanged = (evt) => {
      // evt.detail = { bookId, added } from other parts of app
      // simply refetch to keep server-authoritative state
      fetchFavs();
    };
    const onAuthChanged = () => fetchFavs();

    window.addEventListener("favsChanged", onFavsChanged);
    window.addEventListener("authChanged", onAuthChanged);

    return () => {
      window.removeEventListener("favsChanged", onFavsChanged);
      window.removeEventListener("authChanged", onAuthChanged);
    };
  }, [fetchFavs]);

  const handleRemove = async (bookId) => {
    if (!isLoggedIn) {
      alert("Please login");
      return;
    }
    const confirmRemove = window.confirm("Remove this book from favourites?");
    if (!confirmRemove) return;

    try {
      setRemovingId(bookId);
      const headers = buildHeaders(bookId);
      await axios.put("http://localhost:1000/api/v1/remove-book-from-favourite", {}, { headers });

      // optimistic update: remove locally
      setFavs((prev) => prev.filter((b) => (b._id ?? b).toString() !== bookId.toString()));

      // notify others
      window.dispatchEvent(new CustomEvent("favsChanged", { detail: { bookId, added: false } }));
    } catch (err) {
      console.error("Remove favourite error:", err);
      alert(err.response?.data?.message || "Failed to remove");
    } finally {
      setRemovingId(null);
    }
  };

  if (!isLoggedIn) {
    return <div className="min-h-[40vh] flex items-center justify-center text-zinc-300">Please login to see favourites.</div>;
  }

  if (loading) {
    return <div className="min-h-[40vh] flex items-center justify-center text-zinc-300">Loading favourites...</div>;
  }

  if (error) {
    return <div className="min-h-[40vh] flex items-center justify-center text-red-400">{error}</div>;
  }

  if (!favs || favs.length === 0) {
    return <div className="min-h-[40vh] flex items-center justify-center text-zinc-400">No favourite books yet.</div>;
  }

  return (
    <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-6">Your Favourites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favs.map((book) => {
          const bookId = book._id ?? book;
          return (
            <div key={bookId} className="relative">
              <BookCard data={book} />
              <button
                onClick={() => handleRemove(bookId)}
                disabled={removingId === bookId}
                className="absolute top-3 right-3 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full shadow-md transition"
                title="Remove from favourites"
              >
                <FiTrash2 />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favourite;
