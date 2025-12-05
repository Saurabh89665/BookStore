import { useEffect, useState } from "react";
import "./App.css";

import Navbarpage from "./components/Navbar/Navbarpage";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Allbooks from "./pages/Allbooks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import ViewBookDetails from "./components/ViewBookDetails/ViewBookDetails";

import { Routes, Route } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/auth";
import Favourite from "./components/Profile/Favourite";
import UserOrderHistory from "./components/Profile/UserOrderHistory";

function App() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (id && token && userRole) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(userRole));
    }
  }, []); // <-- FIXED HERE

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbarpage />

      <main className="flex-1 pt-[50px] ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-books" element={<Allbooks />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />}>
              <Route index element={<Favourite></Favourite>}/>
              <Route path="/profile/orderhistory" element={<UserOrderHistory></UserOrderHistory>}/>
              
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/view-book-details/:id" element={<ViewBookDetails />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
