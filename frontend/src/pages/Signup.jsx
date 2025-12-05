import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password || !form.address) {
      alert("⚠️ All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:1000/api/v1/sign-up",
        form
      );

      alert("Signup successful! 🎉");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg bg-zinc-800 border border-zinc-600 px-3 py-1.5 text-sm outline-none placeholder:text-zinc-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition";

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-3">
      
      {/* SMALL CONTAINER */}
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg p-4">
        
        {/* Heading */}
        <div className="mb-4 text-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-300 text-transparent bg-clip-text">
            Create Account
          </h1>
          <p className="text-[11px] text-zinc-400 mt-1">
            Quick signup to continue 📚
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className={inputClass}
            required
          />

          <textarea
            name="address"
            placeholder="Address"
            rows="2"
            value={form.address}
            onChange={handleChange}
            className={`${inputClass} resize-none`}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-black py-2 rounded-lg font-bold text-sm hover:bg-emerald-400 active:scale-95 transition disabled:bg-gray-600"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-3 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-emerald-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
