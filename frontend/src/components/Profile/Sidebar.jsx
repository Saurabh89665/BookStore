import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ data = {} }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    window.dispatchEvent(new Event("authChanged"));
    navigate("/login");
  };

  const avatar = data.avtar || data.avatar || data.url || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
  const cover = data.cover || data.photo || null;

  return (
    <aside className="flex flex-col items-center bg-zinc-900 rounded-xl p-4 shadow-lg">
      <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-emerald-400">
        <img src={avatar} alt="avatar" className="w-full h-full object-cover" onError={(e)=>{ e.target.src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png"; }} />
      </div>

      <h3 className="mt-3 text-lg font-semibold text-zinc-100 text-center">
        {data.username || "Anonymous"}
      </h3>
      <p className="text-xs text-zinc-400 text-center break-words px-2">{data.email || "—"}</p>

      <nav className="w-full mt-4">
        <ul className="flex flex-col gap-2">
          {/* <li>
            <Link to="/profile" className="block px-3 py-2 rounded-md text-zinc-100 hover:bg-zinc-800 transition">
              Profile
            </Link>
          </li> */}
          <li>
            <Link to="/profile" className="block px-3 py-2 rounded-md text-zinc-100 hover:bg-zinc-800 transition">
              Favourites
            </Link>
          </li>
          <li>
            <Link to="/profile/orderhistory" className="block px-3 py-2 rounded-md text-zinc-100 hover:bg-zinc-800 transition">
              Order History
            </Link>
          </li>
          <li>
            <Link to="/profile/settings" className="block px-3 py-2 rounded-md text-zinc-100 hover:bg-zinc-800 transition">
              Settings
            </Link>
          </li>
        </ul>
      </nav>

      {cover && (
        <div className="w-full mt-4 rounded-lg overflow-hidden border border-zinc-800">
          <img src={cover} alt="cover" className="w-full h-28 object-cover" onError={(e)=>{ e.target.style.display='none'; }} />
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-4 w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-md font-semibold transition"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
