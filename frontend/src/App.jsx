import { useEffect } from "react";
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
import { useDispatch } from "react-redux";
import { authActions } from "./store/auth";

import Favourite from "./components/Profile/Favourite";
import UserOrderHistory from "./components/Profile/UserOrderHistory";
import Settings from "./components/Profile/Settings";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (id && token && userRole) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(userRole));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbarpage />

      <main className="flex-1 pt-[50px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all-books" element={<Allbooks />} />
          <Route path="/cart" element={<Cart />} />

          {/* ✅ PROFILE ROUTES */}
          <Route path="/profile" element={<Profile />}>
            <Route index element={<Favourite />} />
            <Route path="orderhistory" element={<UserOrderHistory />} />
            <Route path="settings" element={<Settings></Settings>}/>
          </Route>

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/view-book-details/:id"
            element={<ViewBookDetails />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
