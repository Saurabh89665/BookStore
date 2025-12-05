import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      alert("⚠ Both fields are required");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:1000/api/v1/sign-in",
        form
      );

      console.log("✔ Login Success:", response.data);

      if (response.data?.token) {
        const authData = {
          id: response.data.id,
          role: response.data.role,
          token: response.data.token,
        };

        // ✅ Save auth data in localStorage
        localStorage.setItem("auth", JSON.stringify(authData));
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("role", response.data.role);

        // 🔔 Tell navbar that auth state changed
        window.dispatchEvent(new Event("authChanged"));

        alert("🎉 Login Successful!");

        // 👉 Go to profile page
        navigate("/profile");
      }
    } catch (error) {
      console.log("❌ Login Error:", error.response?.data);
      alert(error.response?.data?.message || "Invalid credentials ❌");
    } finally {
      setLoading(false);
      console.log("🔄 Login Request Completed");
    }
  };

  return (
    <div className="w-full bg-black text-white flex justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900/95 border border-zinc-700 rounded-2xl shadow-xl p-5 mt-24">
        
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-300 to-emerald-400 text-transparent bg-clip-text">
            Login
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Access your account 🔐</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
            className="input-style"
            required
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="input-style"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-black py-2.5 rounded-xl font-semibold text-sm hover:bg-emerald-400 hover:shadow-lg hover:-translate-y-[1px] active:scale-95 transition disabled:bg-gray-600"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
