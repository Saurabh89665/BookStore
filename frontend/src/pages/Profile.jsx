import React, { useEffect, useState } from "react";
import Sidebar from "../components/Profile/Sidebar";
import { Outlet } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = localStorage.getItem("id") || localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!id || !token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const headers = { id, Authorization: `Bearer ${token}` };
        const res = await axios.get(
          "http://localhost:1000/api/v1/get-user-information",
          { headers }
        );
        setProfile(res.data?.data ?? res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white mt-8 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 px-4">
        {/* LEFT */}
        <Sidebar data={profile || {}} />

        {/* RIGHT (CHILD ROUTES HERE) */}
        <div className="bg-zinc-900 rounded-xl p-6 shadow-md min-h-[300px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Profile;
