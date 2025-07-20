import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Pages/Footer';
import Navbar from '../Pages/Navbar';

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
      } catch (err) {
        console.error('User not logged in');
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:3000/event", {
          withCredentials: true,
        });
        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch events.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      setRegistering((prev) => ({ ...prev, [eventId]: true }));
      await axios.post(`http://localhost:3000/event/${eventId}/register`, {}, {
        withCredentials: true,
      });
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, registeredUsers: [...(event.registeredUsers || []), currentUserId] }
            : event
        )
      );
      alert("Successfully registered for the event!");
    } catch (err) {
      console.error(err);
      alert("Failed to register for the event. Please ensure you are logged in.");
    } finally {
      setRegistering((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );


  const isUserRegistered = (event) =>
    currentUserId && Array.isArray(event.registeredUsers) && event.registeredUsers.includes(currentUserId);

  return (
    <div className="bg-gradient-to-b from-indigo-900 via-purple-50 to-white min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto pt-30 pb-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">All Events</h1>
          <button
            onClick={() => navigate('/events/add')}
            className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-semibold rounded-full px-7 py-3 shadow-lg hover:scale-105 hover:from-indigo-700 hover:to-purple-600 transition-all duration-300 border-none"
          >
            + Add Event
          </button>
        </div>
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-gray-200 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-700 placeholder-gray-400"
          />
        </div>
        <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900 tracking-tight">Upcoming Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl shadow-xl border border-indigo-100 hover:border-indigo-400 p-7 hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2 flex flex-col justify-between"
            >
              {event.media && event.media.length > 0 && event.media[0].type === "image" ? (
                <img
                  src={event.media[0].url}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-t-2xl flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <h2 className="text-2xl font-bold mt-4 mb-2 group-hover:text-indigo-700 transition">{event.title.toUpperCase()}</h2>
              <p className="text-gray-600 line-clamp-3 mb-2">{event.description}</p>
              <div className="text-sm text-gray-500 mb-2">{new Date(event.date).toLocaleString()}</div>
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => navigate(`/events/${event._id}`)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-semibold rounded-full px-6 py-2 shadow-lg hover:scale-105 hover:from-indigo-700 hover:to-purple-600 transition-all duration-300 border-none"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleRegister(event._id)}
                  disabled={isUserRegistered(event) || registering[event._id]}
                  className={`${isUserRegistered(event) ? 'bg-gray-400 cursor-not-allowed' : registering[event._id] ? 'bg-green-300' : 'bg-green-500 hover:bg-green-600'} text-white px-6 py-2 rounded-full shadow transition w-full text-center font-semibold`}
                >
                  {isUserRegistered(event)
                    ? 'Registered'
                    : registering[event._id]
                      ? 'Registering...'
                      : 'Register'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventLanding;
