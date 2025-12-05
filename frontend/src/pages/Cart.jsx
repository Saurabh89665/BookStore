import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id") || localStorage.getItem("userId");
  const isLoggedIn = !!token && !!userId;

  const headers = {
    id: userId,
    Authorization: `Bearer ${token}`,
  };

  // 🔁 Cart fetch करणारा function
  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCart([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:1000/api/v1/get-user-cart",
        { headers }
      );
      setCart(res.data?.data ?? []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, userId, token]);

  useEffect(() => {
    fetchCart();

    const onCartChanged = () => fetchCart();
    window.addEventListener("cartChanged", onCartChanged);

    return () => {
      window.removeEventListener("cartChanged", onCartChanged);
    };
  }, [fetchCart]);

  // 🗑 Remove from cart
  const handleRemove = async (bookId) => {
    if (!isLoggedIn) {
      alert("Please login to remove items.");
      return;
    }

    if (!window.confirm("Remove this book from your cart?")) return;

    try {
      setRemovingId(bookId);

      await axios.put(
        `http://localhost:1000/api/v1/remove-from-cart/${bookId}`,
        {},
        {
          headers: {
            ...headers,
            bookid: bookId,
          },
        }
      );

      setCart((prev) => prev.filter((b) => b._id !== bookId));

      window.dispatchEvent(
        new CustomEvent("cartChanged", { detail: { bookId, removed: true } })
      );
    } catch (err) {
      console.error("Remove cart error:", err);
      alert(err.response?.data?.message || "Could not remove item!");
    } finally {
      setRemovingId(null);
    }
  };

  // 🧮 Total books & total amount
  const totalBooks = cart.length;
  const totalAmount = cart.reduce((sum, b) => {
    const price = Number(b.price || 0);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  if (!isLoggedIn) {
    return (
      <div className="text-center py-20 text-zinc-300 text-lg">
        Please login to view your cart.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-zinc-300 text-lg">
        Loading cart...
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-400 text-lg">
        Your cart is empty 🛒
      </div>
    );
  }

  // ✅ Cart UI
  return (
    <div className="px-4 sm:px-8 py-10 max-w-6xl mx-auto text-white mt-10">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      {/* Left: list of items | Right: summary card */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* LEFT SIDE – row wise cards */}
        <div className="space-y-4">
          {cart.map((book) => (
            <div
              key={book._id}
              className="flex items-center justify-between gap-4 bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-md"
            >
              {/* LEFT PART: image + title + author */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-20 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={book.url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://cdn-icons-png.flaticon.com/512/3145/3145765.png";
                    }}
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-semibold text-white truncate">
                    {book.title}
                  </h2>
                  <p className="text-xs text-zinc-400 truncate">
                    by <span className="text-emerald-300">{book.author}</span>
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">
                    {book.desc}
                  </p>
                </div>
              </div>

              {/* RIGHT PART: price + remove */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="text-emerald-400 font-bold text-base">
                  ₹{book.price}
                </span>
                <button
                  onClick={() => handleRemove(book._id)}
                  disabled={removingId === book._id}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-600 hover:bg-red-500 rounded-md shadow disabled:opacity-60 transition"
                >
                  <FiTrash2 className="text-sm" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE – Summary Card */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between text-sm text-zinc-300 mb-2">
            <span>No. of books</span>
            <span className="font-medium">{totalBooks}</span>
          </div>

          <div className="flex justify-between text-sm text-zinc-300 mb-4">
            <span>Subtotal</span>
            <span className="font-medium">₹{totalAmount}</span>
          </div>

          <hr className="border-zinc-700 mb-4" />

          <div className="flex justify-between text-base font-semibold text-white mb-4">
            <span>Total Amount</span>
            <span className="text-emerald-400">₹{totalAmount}</span>
          </div>

          <button
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-2.5 rounded-lg transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
