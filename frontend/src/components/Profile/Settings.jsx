import React, { useEffect, useState } from "react";
import axios from "axios";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id") || localStorage.getItem("userId");

  // 🔹 Fetch user information
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const headers = {
          id: userId,
          Authorization: `Bearer ${token}`,
        };

        const res = await axios.get(
          "http://localhost:1000/api/v1/get-user-information",
          { headers }
        );

        setUser(res.data);
        setAddress(res.data.address || "");
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, userId]);

  // 🔹 Update address
  const handleUpdateAddress = async () => {
    if (!address.trim()) {
      alert("Address cannot be empty");
      return;
    }

    try {
      setSaving(true);

      const headers = {
        id: userId,
        Authorization: `Bearer ${token}`,
      };

      await axios.put(
        "http://localhost:1000/api/v1/update-address",
        { address },
        { headers }
      );

      alert("Address updated successfully ✅");
    } catch (error) {
      console.error("Update address error:", error);
      alert("Failed to update address");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-zinc-300 py-10">
        Loading settings...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-zinc-400 py-10">
        Unable to load user data
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">
        Account Settings
      </h2>

      {/* USER INFO */}
      <div className="bg-zinc-800 rounded-lg p-5 mb-6">
        <h3 className="text-lg font-medium text-white mb-4">
          Profile Information
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-400">Username</span>
            <span className="text-white">{user.username}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-400">Email</span>
            <span className="text-white">{user.email}</span>
          </div>
        </div>
      </div>

      {/* ADDRESS UPDATE */}
      <div className="bg-zinc-800 rounded-lg p-5">
        <h3 className="text-lg font-medium text-white mb-4">
          Update Address
        </h3>

        <textarea
          rows="4"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-3 text-white text-sm focus:outline-none focus:border-emerald-500"
          placeholder="Enter your address"
        />

        <button
          onClick={handleUpdateAddress}
          disabled={saving}
          className="mt-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-semibold px-6 py-2 rounded-md transition"
        >
          {saving ? "Saving..." : "Update Address"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
