import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id") || localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const headers = {
          id: userId,
          Authorization: `Bearer ${token}`,
        };

        const res = await axios.get(
          "http://localhost:1000/api/v1/get-order-history",
          { headers }
        );

        setOrders(res.data?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, userId]);

  // 🔹 description → 10 words only
  const shortDesc = (text = "") => {
    const words = text.split(" ");
    return words.length > 10
      ? words.slice(0, 10).join(" ") + " ..."
      : text;
  };

  if (loading) {
    return (
      <div className="text-center text-zinc-300 py-10">
        Loading order history...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center text-zinc-400 py-10">
        No orders found 📦
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">
        Order History
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-zinc-900 rounded-lg">
          <thead className="bg-zinc-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm text-zinc-300">
                Sr. No
              </th>
              <th className="px-4 py-3 text-left text-sm text-zinc-300">
                Book Name
              </th>
              <th className="px-4 py-3 text-left text-sm text-zinc-300">
                Description
              </th>
              <th className="px-4 py-3 text-left text-sm text-zinc-300">
                Price
              </th>
              <th className="px-4 py-3 text-left text-sm text-zinc-300">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm text-zinc-300">
                Mode
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order._id}
                className="border-t border-zinc-700 hover:bg-zinc-800"
              >
                {/* Sr No */}
                <td className="px-4 py-3 text-sm text-zinc-200 whitespace-nowrap">
                  {index + 1}
                </td>

                {/* ✅ BOOK NAME ONLY (NO IMAGE) */}
                <td
                  className="px-4 py-3 text-sm text-emerald-400 font-medium cursor-pointer hover:underline whitespace-nowrap"
                  onClick={() =>
                    navigate(`/view-book-details/${order.book?._id}`)
                  }
                >
                  {order.book?.title}
                </td>

                {/* Description */}
                <td className="px-4 py-3 text-sm text-zinc-400">
                  {shortDesc(order.book?.desc)}
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-sm font-semibold text-white whitespace-nowrap">
                  ₹{order.price ?? order.book?.price}
                </td>

                {/* Status */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500 text-black">
                    {order.status}
                  </span>
                </td>

                {/* Mode */}
                <td className="px-4 py-3 text-sm text-zinc-300 whitespace-nowrap">
                  {order.paymentMode}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserOrderHistory;
