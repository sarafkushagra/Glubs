import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Pages/Footer';
import Navbar from '../Pages/Navbar';
import { Eye, CheckCircle, Calendar, MapPin, Users, Loader2 } from 'lucide-react';
import { BrainCircuit, Hammer, BookOpen, HelpCircle, Users2, Award, Palette, Calendar as CalendarIcon } from 'lucide-react';

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

  // Event type to icon mapping
  const eventTypeIcons = {
    Hackathon: <BrainCircuit className="text-indigo-500 w-6 h-6" title="Hackathon" />,
    Workshop: <Hammer className="text-indigo-500 w-6 h-6" title="Workshop" />,
    Seminar: <BookOpen className="text-indigo-500 w-6 h-6" title="Seminar" />,
    Quiz: <Award className="text-indigo-500 w-6 h-6" title="Quiz" />,
    Conference: <Users2 className="text-indigo-500 w-6 h-6" title="Conference" />,
    "Case Study": <HelpCircle className="text-indigo-500 w-6 h-6" title="Case Study" />,
    "Creative Showcase": <Palette className="text-indigo-500 w-6 h-6" title="Creative Showcase" />,
    Other: <CalendarIcon className="text-indigo-300 w-6 h-6" title="Other" />,
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 min-h-screen font-[Poppins] relative overflow-x-hidden">
      {/* Optional: Add a subtle background pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 z-0 dark:opacity-20" style={{background: 'radial-gradient(circle at 60% 40%, #a5b4fc 0%, transparent 70%)'}}></div>
      <Navbar />

      <div className="max-w-6xl mx-auto pt-24 pb-10 px-4 relative z-10">
        {/* Centered hero section */}
        <div className="flex flex-col items-center justify-center mb-10 gap-6 w-full pt-8">
          <div className='flex justify-between items-center w-full px-4'>
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 dark:text-white tracking-tight drop-shadow-sm text-center">Explore Opportunities</h1>
           <button
            onClick={() => navigate('/hosts')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full px-6 py-3 shadow-md transition duration-300 text-lg"
          >
            + Host
          </button>
          </div>
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full items-center md:w-1/2 p-4 rounded-full border border-blue-100 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-lg placeholder-gray-400 dark:placeholder-gray-500 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition"
            style={{ fontFamily: 'Poppins, sans-serif', WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}
          />
         
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500 text-lg font-semibold">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-blue-50/80 dark:bg-gray-800/80 rounded-3xl border border-blue-100 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition group shadow-md hover:shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden min-h-[340px]"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {/* Accent bar and icon */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="rounded-full bg-blue-100 dark:bg-gray-800 p-2 shadow">
                    {eventTypeIcons[event.eventType] || eventTypeIcons.Other}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-200">
                    {event.eventType || 'Event'}
                  </span>
                </div>
                <Link to={`/events/${event._id}`} className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-indigo-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 mb-1 leading-tight">{event.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">{event.description?.slice(0, 80) || ''}</p>
                  </div>

                  <div className="mb-2 mt-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-300">Venue: </span>
                    <span className="inline-flex items-center gap-2 text-sm bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200 rounded-full px-3 py-1 w-fit font-semibold">
                      {event.venue || "No Venue Specified"}
                    </span>
                  </div>

                  <div className="flex items-center mt-2 gap-1">
                    {event.participantAvatars?.slice(0, 3).map((avatar, idx) => (
                      <img
                        key={idx}
                        src={avatar}
                        alt={`participant-${idx}`}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 -ml-2 first:ml-0 shadow"
                      />
                    ))}
                    <span className="text-green-600 dark:text-green-400 text-sm ml-2 font-semibold">
                      +{event.registeredUsers?.length || 0} participating
                    </span>
                  </div>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className="bg-blue-50 dark:bg-gray-800 text-xs rounded-full px-3 py-1 font-semibold text-indigo-700 dark:text-indigo-200">{event.mode || "Offline"}</span>
                    <span className="bg-blue-50 dark:bg-gray-800 text-xs rounded-full px-3 py-1 font-semibold text-indigo-700 dark:text-indigo-200">{event.status || "Open"}</span>
                    <span className="bg-blue-50 dark:bg-gray-800 text-xs rounded-full px-3 py-1 font-semibold text-indigo-700 dark:text-indigo-200">
                      STARTS {new Date(event.date).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => handleRegister(event._id)}
                  disabled={isUserRegistered(event) || registering[event._id]}
                  className={`mt-5 py-2 rounded-full text-white font-semibold transition w-full text-base shadow-md
                    ${isUserRegistered(event) ? "bg-gray-400 cursor-not-allowed" :
                      registering[event._id] ? "bg-green-400 animate-pulse" :
                        "bg-indigo-600 hover:bg-indigo-700"}
                  `}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {isUserRegistered(event)
                    ? "Registered"
                    : registering[event._id]
                      ? "Registering..."
                      : "Apply now"}
                </button>
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
