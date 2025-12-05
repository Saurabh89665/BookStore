import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbarpage = () => {
  const navRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  // set CSS variable --navbar-height based on actual nav height
  const setNavHeight = () => {
    if (!navRef.current) return;
    const height = navRef.current.offsetHeight;
    document.documentElement.style.setProperty("--navbar-height", `${height}px`);
  };

  useEffect(() => {
    // initial
    setNavHeight();

    // recalc on window resize / orientation
    window.addEventListener("resize", setNavHeight);
    window.addEventListener("orientationchange", setNavHeight);
    return () => {
      window.removeEventListener("resize", setNavHeight);
      window.removeEventListener("orientationchange", setNavHeight);
    };
  }, []);

  // IMPORTANT: recalc when menu open state or auth changes (DOM inside navbar changes)
  useEffect(() => {
    // small delay so DOM updates (menu open/close) finish before measuring
    const t = setTimeout(() => setNavHeight(), 50);
    return () => clearTimeout(t);
  }, [open, isLoggedIn]);

  // authChanged event वर navbar update AND recalc height
  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      // recalc after auth update
      setTimeout(() => setNavHeight(), 50);
    };

    window.addEventListener("authChanged", handleAuthChange);
    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  // base links
  const links = [
    { title: "Home", link: "/" },
    { title: "All Books", link: "/all-books" },
  ];

  if (isLoggedIn) {
    links.push({ title: "Cart", link: "/cart" });
    links.push({ title: "Profile", link: "/profile" });
  }

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black via-gray-900 to-black shadow-lg backdrop-blur-lg"
    >
      <div className="mx-[10px] max-w-full flex flex-wrap md:flex-nowrap items-center justify-between py-4 gap-4 text-white">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center bg-white/10 rounded-full text-xl">
            📚
          </div>
          <h1 className="text-2xl font-bold tracking-wide">
            Book<span className="text-emerald-400">Heaven</span>
          </h1>
        </Link>

        {/* Mobile menu button */}
        <button onClick={() => setOpen((s) => !s)} className="md:hidden text-white text-3xl">
          ☰
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className="text-sm font-medium hover:text-emerald-400 transition duration-300"
            >
              {item.title}
            </Link>
          ))}

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-md bg-emerald-500 text-black font-semibold hover:bg-emerald-400 active:scale-95 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-md border border-emerald-400 text-emerald-300 font-semibold hover:bg-emerald-500 hover:text-black active:scale-95 transition"
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-400 active:scale-95 transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Dropdown (inside nav so nav height increases when open) */}
        {open && (
          <div className="w-full md:hidden flex flex-col mt-2 gap-3 bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
            {links.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                onClick={() => setOpen(false)}
                className="text-sm font-medium py-2 rounded hover:bg-emerald-500 hover:text-black transition duration-300"
              >
                {item.title}
              </Link>
            ))}

            <hr className="border-gray-600 my-2" />

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="w-full px-4 py-2 rounded-md bg-emerald-500 text-black text-center font-semibold hover:bg-emerald-400 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="w-full px-4 py-2 rounded-md border border-emerald-400 text-emerald-300 text-center font-semibold hover:bg-emerald-500 hover:text-black transition"
                >
                  Signup
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="w-full px-4 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-400 transition"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbarpage;
