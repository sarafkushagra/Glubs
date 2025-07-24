import React, { useState, useEffect } from "react";
import axios from "axios";
import img1 from "../images/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.webp";
import { Link } from "react-router-dom";
import Footer from "../Pages/Footer";
import Navbar from "../Pages/Navbar";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [participatedEvents, setParticipatedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.API_BASE_URL}/users/me`, { withCredentials: true });
        console.log("Fetched user:", res.data);
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user || !user._id) {
      console.log("User or user._id not available, skipping fetchEvents");
      return;
    }

    const fetchEvents = async () => {
      try {
        console.log("Fetching events for userId:", user._id);
        const [participatedRes, upcomingRes, completedRes] = await Promise.all([
          axios.get(`${process.env.API_BASE_URL}/event/participated/${user._id}`, { withCredentials: true }),
          axios.get(`${process.env.API_BASE_URL}/event/upcoming/${user._id}`, { withCredentials: true }),
          axios.get(`${process.env.API_BASE_URL}/event/completed/${user._id}`, { withCredentials: true }),
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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <p className="text-xl animate-pulse">Loading profile data...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-red-500">
        <p className="text-xl">Error: {error}</p>
      </div>
    );
  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <p className="text-xl">No user data found.</p>
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-black pb-12">
        {/* Indigo blurry light effect above header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-[2000px] h-[540px] bg-indigo-500/40 blur-3xl rounded-full opacity-60 pointer-events-none" style={{ filter: 'blur(80px)', top: '-80px' }}></div>
        {/* Profile Header Section */}
        <div className="relative w-full bg-black shadow-sm border-b border-gray-800 px-4 sm:px-8 pt-20 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-8 z-10">
          {/* Edit Profile button on top right for desktop */}
          <div className="hidden md:flex absolute right-8 top-24 z-20">
            <Link to={`/users/edit/${user._id}`}
              className=""
            >
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2 rounded transition shadow">Edit Profile</button>
            </Link>
          </div>
          {/* Avatar and Info/Stats Responsive Layout */}
          <div className="w-full flex flex-col md:flex-row items-center md:items-end gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0 pt-8 pl-0 md:pl-16 flex justify-center w-full md:w-auto">
              <img
                src={img1}
                alt="avatar"
                className="w-32 h-32 md:w-36 md:h-36 rounded-3xl object-cover border-4 border-white bg-white"
              />
            </div>
            {/* Info and Stats */}
            <div className="flex-1 w-full flex flex-col md:flex-row md:justify-between">
              {/* Name, Role, Department, Email */}
              <div className="flex flex-col justify-center md:justify-start md:items-start items-center text-center md:text-left min-w-[200px]">
                <span className="text-2xl font-extrabold text-gray-100">{user.username}</span>
                <span className="text-base font-semibold text-indigo-200 bg-indigo-700/30 px-2 py-0.5 rounded mb-1 mt-1">{user.role}</span>
                <span className="text-gray-400 text-base mb-0.5">{user.department}</span>
                <span className="text-gray-500 text-sm">{user.email}</span></div>
              {/* Stats Row */}
              <div className="w-full md:w-auto mt-6 md:mt-16 flex flex-col items-center md:items-end">
                <div className="grid grid-cols-2 md:flex md:flex-row gap-4 md:gap-10">
                  <div className="flex flex-col items-center min-w-[100px] md:min-w-[120px]">
                    <span className="text-gray-400 text-xs mb-1 text-center">Events Participated</span>
                    <span className="text-2xl font-bold text-gray-100 text-center">{participatedEvents.length}</span>
                  </div>
                  <div className="flex flex-col items-center min-w-[100px] md:min-w-[120px]">
                    <span className="text-gray-400 text-xs mb-1 text-center">Upcoming Events</span>
                    <span className="text-2xl font-bold text-gray-100 text-center">{upcomingEvents.length}</span>
                  </div>
                  <div className="flex flex-col items-center min-w-[100px] md:min-w-[120px]">
                    <span className="text-gray-400 text-xs mb-1 text-center">Completed Events</span>
                    <span className="text-2xl font-bold text-gray-100 text-center">{completedEvents.length}</span>
                  </div>
                  <div className="flex flex-col items-center min-w-[100px] md:min-w-[120px]">
                    <span className="text-gray-400 text-xs mb-1 text-center">Payments Done</span>
                    <span className="text-2xl font-bold text-gray-100 text-center">{user.paymentsDone || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tab Bar */}
        <div className="max-w-5xl mx-auto mt-8 px-4">
          <div className="flex flex-row gap-8 border-b border-gray-800 mb-8">
            <button
              className={`py-2 px-1 text-base font-semibold border-b-2 transition-all duration-150 ${activeTab === "upcoming" ? "border-white text-white" : "border-transparent text-gray-400 hover:text-gray-200"}`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Events
            </button>
            <button
              className={`py-2 px-1 text-base font-semibold border-b-2 transition-all duration-150 ${activeTab === "completed" ? "border-white text-white" : "border-transparent text-gray-400 hover:text-gray-200"}`}
              onClick={() => setActiveTab("completed")}
            >
              Completed Events
            </button>
            <button
              className={`py-2 px-1 text-base font-semibold border-b-2 transition-all duration-150 ${activeTab === "participated" ? "border-white text-white" : "border-transparent text-gray-400 hover:text-gray-200"}`}
              onClick={() => setActiveTab("participated")}
            >
              Events You Participated In
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "upcoming" && (
            <div className="mb-10">
              <h3 className="text-2xl font-extrabold text-gray-100 mb-6">Upcoming Events</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {upcomingEvents.length === 0 ? (
                  <div className="bg-[#18181b] p-8 rounded-2xl shadow text-gray-500 col-span-full">No upcoming events found.</div>
                ) : (
                  upcomingEvents.map((event, idx) => (
                    <Link
                      to={`/events/${event._id}`}
                      key={idx}
                      className="bg-[#18181b] text-gray-100 rounded-2xl p-8 shadow hover:shadow-lg transition duration-200 flex flex-col justify-between hover:scale-[1.03]"
                    >
                      <h4 className="font-bold text-lg mb-2">{event.title}</h4>
                      <p className="text-gray-400 text-sm mb-1">
                        <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-400 text-sm">
                        <span className="font-semibold">Venue:</span> {event.venue || "Venue TBA"}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
          {activeTab === "completed" && (
            <div className="mb-10">
              <h3 className="text-2xl font-extrabold text-gray-100 mb-6">Completed Events</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {completedEvents.length === 0 ? (
                  <div className="bg-[#18181b] p-8 rounded-2xl shadow text-gray-500 col-span-full">No completed events found.</div>
                ) : (
                  completedEvents.map((event, idx) => (
                    <Link
                      to={`/events/details/${event._id}`}
                      key={idx}
                      className="bg-[#18181b] text-gray-100 rounded-2xl p-8 shadow hover:shadow-lg transition duration-200 flex flex-col justify-between hover:scale-[1.03]"
                    >
                      <h4 className="font-bold text-lg mb-2">{event.title}</h4>
                      <p className="text-gray-400 text-sm mb-1">
                        <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-400 text-sm">
                        <span className="font-semibold">Venue:</span> {event.venue || "Venue TBA"}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
          {activeTab === "participated" && (
            <div className="mb-10">
              <h3 className="text-2xl font-extrabold text-gray-100 mb-6">Events You Participated In</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {participatedEvents.length === 0 ? (
                  <div className="bg-[#18181b] p-8 rounded-2xl shadow text-gray-500 col-span-full">You haven't participated in any events yet.</div>
                ) : (
                  participatedEvents.map((event, idx) => (
                    <Link
                      to={`/events/${event._id}`}
                      key={idx}
                      className="bg-[#18181b] text-gray-100 rounded-2xl p-8 shadow hover:shadow-lg transition duration-200 flex flex-col justify-between hover:scale-[1.03]"
                    >
                      <h4 className="font-bold text-lg mb-2">{event.title}</h4>
                      <p className="text-gray-400 text-sm mb-1">
                        <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-400 text-sm">
                        <span className="font-semibold">Venue:</span> {event.venue || "Venue TBA"}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}