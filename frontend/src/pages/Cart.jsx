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

  // 🔁 Cart fetch
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
    window.addEventListener("cartChanged", fetchCart);
    return () => window.removeEventListener("cartChanged", fetchCart);
  }, [fetchCart]);

  // 🗑 Remove from cart
  const handleRemove = async (bookId) => {
    if (!window.confirm("Remove this book from your cart?")) return;

    try {
      setRemovingId(bookId);
      await axios.put(
        `http://localhost:1000/api/v1/remove-from-cart/${bookId}`,
        {},
        { headers }
      );

      setCart((prev) => prev.filter((b) => b._id !== bookId));
      window.dispatchEvent(new Event("cartChanged"));
    } catch (err) {
      alert("Remove failed");
    } finally {
      setRemovingId(null);
    }
  };

  // ✅ ONLY REQUIRED FUNCTION – PLACE ORDER
  const placeOrderFromCart = async () => {
    try {
      await axios.post(
        "http://localhost:1000/api/v1/place-order",
        {},
        { headers }
      );

      alert("Order placed successfully ✅");

      // cart refresh
      fetchCart();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Order failed");
    }
  };

  const totalBooks = cart.length;
  const totalAmount = cart.reduce(
    (sum, b) => sum + Number(b.price || 0),
    0
  );

  if (!isLoggedIn)
    return (
      <div className="text-center py-20 text-zinc-300 text-lg">
        Please login to view your cart.
      </div>
    );

  if (loading)
    return (
      <div className="text-center py-20 text-zinc-300 text-lg">
        Loading cart...
      </div>
    );

  if (cart.length === 0)
    return (
      <div className="text-center py-20 text-zinc-400 text-lg">
        Your cart is empty 🛒
      </div>
    );

  return (
    <div className="px-4 sm:px-8 py-10 max-w-6xl mx-auto text-white mt-10">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* LEFT */}
        <div className="space-y-4">
          {cart.map((book) => (
            <div
              key={book._id}
              className="flex items-center justify-between gap-4 bg-zinc-900 border border-zinc-700 rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={book.url}
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold">{book.title}</h2>
                  <p className="text-sm text-zinc-400">{book.author}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-emerald-400 font-bold">
                  ₹{book.price}
                </span>
                <button
                  onClick={() => handleRemove(book._id)}
                  disabled={removingId === book._id}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-600 rounded"
                >
                  <FiTrash2 />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-5 h-fit sticky top-24">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between text-sm mb-2">
            <span>No. of books</span>
            <span>{totalBooks}</span>
          </div>

          <div className="flex justify-between text-sm mb-4">
            <span>Subtotal</span>
            <span>₹{totalAmount}</span>
          </div>

          <button
            onClick={placeOrderFromCart}
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
