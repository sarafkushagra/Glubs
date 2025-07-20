import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import img1 from "../images/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.webp";
import Footer from "../Pages/Footer";
import Navbar from "../Pages/Navbar";

export default function UsersDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/users/details/${id}`, { withCredentials: true });
        console.log(res.data);
        setUser(res.data);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!id) {
      console.log("User or user._id not available, skipping fetchEvents");
      return;
    }

    const fetchEvents = async () => {
      try {
        console.log("Fetching events for userId:", id);
        const [participatedRes, upcomingRes, completedRes] = await Promise.all([
          axios.get(`http://localhost:3000/event/participated/${id}`, { withCredentials: true }),
          axios.get(`http://localhost:3000/event/upcoming/${id}`, { withCredentials: true }),
          axios.get(`http://localhost:3000/event/completed/${id}`, { withCredentials: true }),
        ]);

        console.log("Participated Events:", participatedRes.data);
        console.log("Upcoming Events:", upcomingRes.data);
        console.log("Completed Events:", completedRes.data);

        setParticipatedEvents(participatedRes.data || []);
        setUpcomingEvents(upcomingRes.data || []);
        setCompletedEvents(completedRes.data || []);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, [user]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No user data found.</div>;

  return (
    <>
    <Navbar/>
    <div className="p-8 mt-30 mb-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">My Profile</h1>
        <Link to={`/users/edit/${user._id}`}>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mb-4">
            Edit Profile
          </button>
        </Link>
      </div>

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 flex items-center gap-6">
        <img src={img1} alt="avatar" className="w-20 h-20 rounded-full border" />
        <div>
          <h2 className="text-xl font-semibold">{user.username}</h2>
          <p className="text-gray-500">{user.department || "Department not specified"}</p>
          <p className="text-gray-500 capitalize">{user.role}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-indigo-50 text-indigo-700 p-4 rounded-lg shadow text-center">
          <h3 className="text-2xl font-bold">{participatedEvents.length}</h3>
          <p className="text-sm mt-1">Events Participated</p>
        </div>
        <div className="bg-purple-50 text-purple-700 p-4 rounded-lg shadow text-center">
          <h3 className="text-2xl font-bold">{upcomingEvents.length}</h3>
          <p className="text-sm mt-1">Upcoming Events</p>
        </div>
        <div className="bg-green-50 text-green-700 p-4 rounded-lg shadow text-center">
          <h3 className="text-2xl font-bold">{completedEvents.length}</h3>
          <p className="text-sm mt-1">Completed Events</p>
        </div>
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg shadow text-center">
          <h3 className="text-2xl font-bold">{user.paymentsDone || 0}</h3>
          <p className="text-sm mt-1">Payments Done</p>
        </div>
      </div>

    
      {/* Upcoming Events */}
<div className="bg-white p-6 rounded-lg shadow mb-8">
  <h3 className="text-xl font-semibold mb-4 text-indigo-700">Upcoming Events</h3>
  {upcomingEvents.length === 0 ? (
    <p className="text-gray-500">No upcoming events.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {upcomingEvents.map((event, idx) => (
        <Link
          to={`/events/${event._id}`}
          key={idx}
          className="bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg p-4 shadow hover:shadow-md transition transform hover:-translate-y-1 cursor-pointer"
        >
          <h4 className="font-bold">{event.title}</h4>
          <p className="text-sm">{new Date(event.date).toLocaleDateString()}</p>
          <p className="text-sm">{event.venue || "Venue TBA"}</p>
        </Link>
      ))}
    </div>
  )}
</div>

{/* Completed Events */}
<div className="bg-white p-6 rounded-lg shadow mb-8">
  <h3 className="text-xl font-semibold mb-4 text-indigo-700">Completed Events</h3>
  {completedEvents.length === 0 ? (
    <p className="text-gray-500">No completed events.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {completedEvents.map((event, idx) => (
        <Link
          to={`/events/details/${event._id}`}
          key={idx}
          className="bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg p-4 shadow hover:shadow-md transition transform hover:-translate-y-1 cursor-pointer"
        >
          <h4 className="font-bold">{event.title}</h4>
          <p className="text-sm">{new Date(event.date).toLocaleDateString()}</p>
          <p className="text-sm">{event.venue || "Venue TBA"}</p>
        </Link>
      ))}
    </div>
  )}
</div>

{/* Participated Events */}
<div className="bg-white p-6 rounded-lg shadow mb-10">
  <h3 className="text-xl font-semibold mb-4 text-indigo-700">Events You Participated In</h3>
  {participatedEvents.length === 0 ? (
    <p className="text-gray-500">You have not participated in any events yet.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {participatedEvents.map((event, idx) => (
        <Link
          to={`/events/${event._id}`}
          key={idx}
          className="bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg p-4 shadow hover:shadow-md transition transform hover:-translate-y-1 cursor-pointer"
        >
          <h4 className="font-bold">{event.title}</h4>
          <p className="text-sm">{new Date(event.date).toLocaleDateString()}</p>
          <p className="text-sm">{event.venue || "Venue TBA"}</p>
        </Link>
      ))}
    </div>
  )}
</div>

    </div>
    <Footer/>
    </>
  );
}
