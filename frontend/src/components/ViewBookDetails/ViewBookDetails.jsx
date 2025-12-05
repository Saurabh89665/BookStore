// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FiShoppingCart, FiHeart } from "react-icons/fi";

// const ViewBookDetails = () => {
//   const { id } = useParams(); // book id from route
//   const navigate = useNavigate();

//   const [book, setBook] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // toggle states
//   const [addedToCart, setAddedToCart] = useState(false);
//   const [addedToFav, setAddedToFav] = useState(false);

//   // small UI busy flags to disable button while request ongoing
//   const [cartLoading, setCartLoading] = useState(false);
//   const [favLoading, setFavLoading] = useState(false);

//   // auth
//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("id") || localStorage.getItem("userId");
//   const isLoggedIn = !!token && !!userId;

//   // redirect if not logged in (you previously wanted that)
//   useEffect(() => {
//     if (!isLoggedIn) {
//       navigate("/login");
//     }
//   }, [isLoggedIn, navigate]);

//   // fetch book + user cart/favourites initial data
//   useEffect(() => {
//     const fetchAll = async () => {
//       setLoading(true);
//       try {
//         // fetch book data
//         const bookRes = await axios.get(
//           `http://localhost:1000/api/v1/get-book-by-id/${id}`
//         );
//         const bookData = bookRes.data?.data ?? null;
//         setBook(bookData);

//         if (isLoggedIn) {
//           // prepare headers used by your backend
//           const headers = {
//             id: userId,
//             Authorization: `Bearer ${token}`,
//           };

//           // fetch user's cart
//           try {
//             const cartRes = await axios.get(
//               "http://localhost:1000/api/v1/get-user-cart",
//               { headers }
//             );
//             const cartArr = cartRes.data?.data ?? [];
//             // check if book is in cart
//             if (cartArr.find((b) => (b._id || b) == (bookData?._id || id))) {
//               setAddedToCart(true);
//             }
//           } catch (err) {
//             console.warn("Could not fetch user cart:", err);
//           }

//           // fetch user's favourites
//           try {
//             const favRes = await axios.get(
//               "http://localhost:1000/api/v1/get-favourite-book",
//               { headers }
//             );
//             const favArr = favRes.data?.data ?? [];
//             if (favArr.find((b) => (b._id || b) == (bookData?._id || id))) {
//               setAddedToFav(true);
//             }
//           } catch (err) {
//             console.warn("Could not fetch user favourites:", err);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching book:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id, isLoggedIn]); // re-run when book id or auth changes

//   if (!isLoggedIn) return null; // immediate nothing (redirect in effect)

//   if (loading)
//     return (
//       <p className="text-center py-10 text-zinc-300 text-lg">Loading...</p>
//     );

//   if (!book)
//     return (
//       <p className="text-center py-10 text-red-400 text-lg">Book not found ❌</p>
//     );

//   // helper to build headers (backend expects id & bookid in headers)
//   const buildHeaders = () => ({
//     id: userId,
//     bookid: book._id || id,
//     Authorization: `Bearer ${token}`,
//   });

//   // Toggle cart (add or remove)
//   const handleCartToggle = async () => {
//     if (cartLoading) return;
//     setCartLoading(true);

//     try {
//       const headers = buildHeaders();

//       if (!addedToCart) {
//         // add to cart
//         const res = await axios.put(
//           "http://localhost:1000/api/v1/add-to-cart",
//           {},
//           { headers }
//         );
//         console.log("Added to cart:", res.data);
//         setAddedToCart(true);
//       } else {
//         // remove from cart
//         // your backend route uses PUT /remove-from-cart/:bookid but also reads headers.bookid
//         // we'll call without params and pass headers.bookid (matching your server)
//         const res = await axios.put(
//           `http://localhost:1000/api/v1/remove-from-cart/${book._id}`,
//           {},
//           { headers }
//         );
//         console.log("Removed from cart:", res.data);
//         setAddedToCart(false);
//       }
//     } catch (err) {
//       console.error("Cart toggle error:", err.response || err);
//       alert(err.response?.data?.message || "Failed to update cart");
//     } finally {
//       setCartLoading(false);
//     }
//   };

//   // Toggle favourite (add or remove)
//   const handleFavToggle = async () => {
//     if (favLoading) return;
//     setFavLoading(true);

//     try {
//       const headers = buildHeaders();

//       if (!addedToFav) {
//         // add favourite
//         const res = await axios.put(
//           "http://localhost:1000/api/v1/add-book-to-favourite",
//           {},
//           { headers }
//         );
//         console.log("Added to favourites:", res.data);
//         setAddedToFav(true);
//       } else {
//         // remove favourite
//         const res = await axios.put(
//           "http://localhost:1000/api/v1/remove-book-from-favourite",
//           {},
//           { headers }
//         );
//         console.log("Removed from favourites:", res.data);
//         setAddedToFav(false);
//       }
//     } catch (err) {
//       console.error("Favourite toggle error:", err.response || err);
//       alert(err.response?.data?.message || "Failed to update favourites");
//     } finally {
//       setFavLoading(false);
//     }
//   };

//   return (
//     <div className="px-4 sm:px-8 mt-10 py-10 bg-black text-white">
//       <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
//         {/* Left image */}
//         <div className="w-full lg:w-[40%] bg-zinc-800 rounded-xl overflow-hidden h-[500px] shadow-md">
//           <img
//             src={book.url}
//             className="w-full h-full object-cover object-top"
//             alt={book.title}
//             onError={(e) => {
//               e.target.src =
//                 "https://cdn-icons-png.flaticon.com/512/3145/3145765.png";
//             }}
//           />
//         </div>

//         {/* Right content */}
//         <div className="flex flex-col gap-4 lg:w-[60%] overflow-y-auto max-h-[500px] pr-3">
//           <h1 className="text-4xl font-bold text-emerald-400">{book.title}</h1>

//           <p className="text-lg text-zinc-400">
//             ✍ Author: <span className="text-emerald-300">{book.author}</span>
//           </p>

//           <h2 className="text-3xl font-semibold text-emerald-400">
//             ₹{book.price}
//           </h2>

//           <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
//             {book.desc}
//           </p>

//           {/* Buttons */}
//           <div className="flex gap-3 mt-6">
//             <button
//               onClick={handleCartToggle}
//               disabled={cartLoading}
//               className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
//                 addedToCart
//                   ? "bg-green-600 text-white"
//                   : "bg-emerald-500 text-black hover:bg-emerald-400"
//               }`}
//             >
//               <FiShoppingCart />
//               {cartLoading ? "..." : addedToCart ? "Added to Cart ✔" : "Add to Cart"}
//             </button>

//             <button
//               onClick={handleFavToggle}
//               disabled={favLoading}
//               className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
//                 addedToFav
//                   ? "bg-pink-600 text-white"
//                   : "bg-zinc-800 text-white hover:bg-zinc-700"
//               }`}
//             >
//               <FiHeart className="text-lg" />
//               {favLoading ? "..." : addedToFav ? "Added ♥" : "Favourite"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewBookDetails;


// src/components/ViewBookDetails/ViewBookDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiShoppingCart, FiHeart } from "react-icons/fi";

const ViewBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToFav, setAddedToFav] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id") || localStorage.getItem("userId");
  const isLoggedIn = !!token && !!userId;

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const bookRes = await axios.get(
          `http://localhost:1000/api/v1/get-book-by-id/${id}`
        );
        const bookData = bookRes.data?.data ?? null;
        setBook(bookData);

        if (isLoggedIn && bookData) {
          const headers = { id: userId, Authorization: `Bearer ${token}` };

          // check cart membership
          try {
            const cartRes = await axios.get(
              "http://localhost:1000/api/v1/get-user-cart",
              { headers }
            );
            const cartArr = cartRes.data?.data ?? [];
            if (cartArr.find((b) => (b._id || b) == (bookData._id || id))) {
              setAddedToCart(true);
            }
          } catch (e) {
            console.warn("cart fetch failed", e);
          }

          // check favourite membership
          try {
            const favRes = await axios.get(
              "http://localhost:1000/api/v1/get-favourite-book",
              { headers }
            );
            const favArr = favRes.data?.data ?? [];
            if (favArr.find((b) => (b._id || b) == (bookData._id || id))) {
              setAddedToFav(true);
            }
          } catch (e) {
            console.warn("favs fetch failed", e);
          }
        }
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    // eslint-disable-next-line
  }, [id, isLoggedIn]);

  if (!isLoggedIn) return null;
  if (loading) return <p className="text-center py-10 text-zinc-300">Loading...</p>;
  if (!book) return <p className="text-center py-10 text-red-400">Book not found ❌</p>;

  const buildHeaders = () => ({
    id: userId,
    bookid: book._id || id,
    Authorization: `Bearer ${token}`,
  });

  const handleCartToggle = async () => {
    if (cartLoading) return;
    setCartLoading(true);
    try {
      const headers = buildHeaders();
      if (!addedToCart) {
        await axios.put("http://localhost:1000/api/v1/add-to-cart", {}, { headers });
        setAddedToCart(true);
        // optionally dispatch event for cart update
        window.dispatchEvent(new CustomEvent("cartChanged", { detail: { bookId: book._id, added: true } }));
      } else {
        await axios.put(`http://localhost:1000/api/v1/remove-from-cart/${book._id}`, {}, { headers });
        setAddedToCart(false);
        window.dispatchEvent(new CustomEvent("cartChanged", { detail: { bookId: book._id, added: false } }));
      }
    } catch (err) {
      console.error(err);
      alert("Cart update failed");
    } finally {
      setCartLoading(false);
    }
  };

  const handleFavToggle = async () => {
    if (favLoading) return;
    setFavLoading(true);
    try {
      const headers = buildHeaders();
      if (!addedToFav) {
        await axios.put("http://localhost:1000/api/v1/add-book-to-favourite", {}, { headers });
        setAddedToFav(true);
        // IMPORTANT: dispatch favsChanged event so other components can refresh
        window.dispatchEvent(new CustomEvent("favsChanged", { detail: { bookId: book._id, added: true } }));
      } else {
        await axios.put("http://localhost:1000/api/v1/remove-book-from-favourite", {}, { headers });
        setAddedToFav(false);
        window.dispatchEvent(new CustomEvent("favsChanged", { detail: { bookId: book._id, added: false } }));
      }
    } catch (err) {
      console.error(err);
      alert("Favourite update failed");
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-8 mt-10 py-10 bg-black text-white">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-[40%] bg-zinc-800 rounded-xl overflow-hidden h-[500px] shadow-md">
          <img src={book.url} className="w-full h-full object-cover object-top" alt={book.title} />
        </div>

        <div className="flex flex-col gap-4 lg:w-[60%] overflow-y-auto max-h-[500px] pr-3">
          <h1 className="text-4xl font-bold text-emerald-400">{book.title}</h1>
          <p className="text-lg text-zinc-400">✍ Author: <span className="text-emerald-300">{book.author}</span></p>
          <h2 className="text-3xl font-semibold text-emerald-400">₹{book.price}</h2>
          <p className="text-zinc-300 leading-relaxed whitespace-pre-line">{book.desc}</p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCartToggle}
              disabled={cartLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${addedToCart ? "bg-green-600 text-white" : "bg-emerald-500 text-black hover:bg-emerald-400"}`}
            >
              <FiShoppingCart /> {cartLoading ? "..." : addedToCart ? "Added to Cart ✔" : "Add to Cart"}
            </button>

            <button
              onClick={handleFavToggle}
              disabled={favLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${addedToFav ? "bg-pink-600 text-white" : "bg-zinc-800 text-white hover:bg-zinc-700"}`}
            >
              <FiHeart className="text-lg" /> {favLoading ? "..." : addedToFav ? "Added ♥" : "Favourite"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBookDetails;
