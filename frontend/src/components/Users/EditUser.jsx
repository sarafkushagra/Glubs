import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../Pages/Footer";
import Navbar from "../Pages/Navbar";

export default function EditProfile() {
  const { id } = useParams();
  console.log("Editing user with ID:", id);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    age: "",
    yearOfStudy: "",
    department: "",
    isClubMember: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/details/${id}`, {
          withCredentials: true,
        });
        console.log(res.data);
        
        setUser({
          username: res.data.username || "",
          email: res.data.email || "",
          age: res.data.age || "",
          yearOfStudy: res.data.yearOfStudy || "",
          department: res.data.department || "",
          isClubMember: res.data.isClubMember || false,
        });
      } catch (err) {
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/${id}`, user, {
        withCredentials: true,
      });
      setSuccess("Profile updated successfully!");
      setTimeout(() => navigate(`/profile`), 150);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    }
  };

  if (loading) return <div className="text-center text-indigo-600">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <>
    <Navbar/>
    <div className="max-w-xl mt-30 mb-10 mx-auto p-6 bg-purple-50 rounded-xl shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Edit Profile</h2>

      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-purple-700 font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
        </div>

        <div>
          <label className="block text-purple-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
        </div>

        <div>
          <label className="block text-purple-700 font-medium">Age</label>
          <input
            type="number"
            name="age"
            value={user.age}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div>
          <label className="block text-purple-700 font-medium">Year of Study</label>
          <input
            type="text"
            name="yearOfStudy"
            value={user.yearOfStudy}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div>
          <label className="block text-purple-700 font-medium">Department</label>
          <input
            type="text"
            name="department"
            value={user.department}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>


        <div className="flex items-center">
          <input
            type="checkbox"
            name="isClubMember"
            checked={user.isClubMember}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-purple-700 font-medium">Is Club Member</label>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
    <Footer/>
    </>
  );
}
