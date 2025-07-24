import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowRight, Trash2, Search } from "lucide-react";
import Footer from "../Pages/Footer";
import Navbar from "../Pages/Navbar";
export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmUsername, setConfirmUsername] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.API_BASE_URL}/users`, { withCredentials: true });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };
    fetchUsers();
  }, []);

  

  const handleDelete = async (userId, username) => {
    if (confirmUsername !== username) {
      alert("Username does not match. Please type the exact username to confirm deletion.");
      return;
    }

    try {
      await axios.delete(`${process.env.API_BASE_URL}/users/${userId}`, { withCredentials: true });
      setUsers(prev => prev.filter(user => user._id !== userId));
      setConfirmDeleteId(null);
      setConfirmUsername("");
      alert("User deleted successfully.");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

const filteredUsers = users.filter(user =>
  (user.username?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
  (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
);


  if (loading) return <div className="text-center text-purple-600 mt-10">Loading users...</div>;

  return (
    <>
    <Navbar/>
    <div className="mt-30 max-w-5xl mb-10 mx-auto p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-4 text-center">All Users</h1>

      <div className="flex items-center gap-2 mb-6">
        <Search className="text-purple-600" />
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center text-purple-600">No users found.</div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map(user => (
            <div
              key={user._id}
              className="bg-purple-50 border border-purple-200 rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-purple-800">{user.username}</h2>
                  <p className="text-purple-600 text-sm">Role: {user.role}</p>
                  <p className="text-purple-600 text-sm">Study: {user.yearOfStudy || "N/A"}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Link
                    to={`/users/details/${user._id}`}
                    className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-medium"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                  {confirmDeleteId === user._id ? (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Type username to confirm"
                        value={confirmUsername}
                        onChange={e => setConfirmUsername(e.target.value)}
                        className="p-1 border rounded text-sm mb-1"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => {
                            setConfirmDeleteId(null);
                            setConfirmUsername("");
                          }}
                          className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setConfirmDeleteId(user._id);
                        setConfirmUsername("");
                      }}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
}
