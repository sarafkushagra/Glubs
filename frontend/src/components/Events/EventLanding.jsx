import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Pages/Footer';
import Navbar from '../Pages/Navbar';
import { Eye, CheckCircle, Calendar, MapPin, Users, Loader2 } from 'lucide-react';

const EventLanding = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState({});
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch current logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:3000/users/me', { withCredentials: true });
        setCurrentUserId(res.data.user._id);
      } catch {
        console.error('User not logged in');
      }
    };
    fetchUser();
  }, []);

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:3000/event', { withCredentials: true });
        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      setRegistering((prev) => ({ ...prev, [eventId]: true }));
      await axios.post(`http://localhost:3000/event/${eventId}/register`, {}, { withCredentials: true });
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId ? { ...e, registeredUsers: [...(e.registeredUsers || []), currentUserId] } : e
        )
      );
      alert('Registered successfully!');
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please ensure you are logged in.');
    } finally {
      setRegistering((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  const isUserRegistered = (event) =>
    currentUserId && Array.isArray(event.registeredUsers) && event.registeredUsers.includes(currentUserId);

  return (
    <div className="bg-gradient-to-b from-indigo-900 via-purple-50 to-white min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto pt-24 pb-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900">Explore Opportunities</h1>
          <button
            onClick={() => navigate('/events/add')}
            className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-full px-6 py-3 shadow hover:scale-105 transition duration-300"
          >
            + Host New Event
          </button>
        </div>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white placeholder-gray-400 shadow"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-purple-600 w-10 h-10" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-2xl border border-gray-200 hover:border-purple-500 transition group shadow-sm hover:shadow-lg p-5 flex flex-col justify-between relative"
              >
                <Link to={`/events/${event._id}`} className="">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-purple-600">{event.title}</h2>
                    <p className="text-sm text-gray-500">{event.eventType || "Event"}</p>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-xs font-medium text-gray-500">Venue: </span>
                  <div className="mt-1 inline-flex items-center gap-2 text-sm bg-gray-100 rounded-full px-3 py-1 w-fit">
                    {event.venue || "No Venue Specified"}
                  </div>
                </div>

                <div className="flex items-center mt-2 gap-1">
                  {event.participantAvatars?.slice(0, 3).map((avatar, idx) => (
                    <img
                      key={idx}
                      src={avatar}
                      alt={`participant-${idx}`}
                      className="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0"
                    />
                  ))}
                  <span className="text-green-600 text-sm ml-2">
                    +{event.registeredUsers?.length || 0} participating
                  </span>
                </div>

                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="bg-gray-100 text-xs rounded-full px-3 py-1">{event.mode || "Offline"}</span>
                  <span className="bg-gray-100 text-xs rounded-full px-3 py-1">{event.status || "Open"}</span>
                  <span className="bg-gray-100 text-xs rounded-full px-3 py-1">
                    STARTS {new Date(event.date).toLocaleDateString('en-GB')}
                  </span>
                </div>

                <button
                  onClick={() => handleRegister(event._id)}
                  disabled={isUserRegistered(event) || registering[event._id]}
                  className={`mt-4 py-2 rounded-full text-white font-semibold transition w-full
          ${isUserRegistered(event) ? "bg-gray-400 cursor-not-allowed" :
                      registering[event._id] ? "bg-green-400 animate-pulse" :
                        "bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600"}
        `}
                >
                  {isUserRegistered(event)
                    ? "Registered"
                    : registering[event._id]
                      ? "Registering..."
                      : "Apply now"}
                </button>
                </Link>
              </div>
            ))}
          </div>

        )}
      </div>

      <Footer />
    </div>
  );
};

export default EventLanding;
