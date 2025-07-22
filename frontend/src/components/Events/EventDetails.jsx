import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Pages/Footer';
import Navbar from '../Pages/Navbar';
import {
  CalendarDays,
  MapPin,
  Users,
  UserCircle,
  Video,
  Image as ImageIcon,
  Phone,
  Mail,
  Tag,
  DollarSign,
  Globe,
  PencilIcon,
  Trash,
  MessageSquarePlus,
  BrainCircuit, Hammer, BookOpen, HelpCircle, Users2, Award, Palette, Calendar as CalendarIcon
} from 'lucide-react';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/event/${eventId}`, { withCredentials: true });
        setEvent(res.data.event);
        setFeedbacks(res.data.feedbacks);

        const userRes = await axios.get('http://localhost:3000/users/me', { withCredentials: true });
        setUser(userRes.data.user);
      } catch (err) {
        console.error(err);
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`http://localhost:3000/event/${eventId}`, { withCredentials: true });
      navigate('/events');
    } catch {
      alert('Failed to delete event.');
    }
  };

  const handleEdit = () => navigate(`/events/edit/${eventId}`);
  const handleEditFeedback = (feedbackId) => navigate(`/events/${eventId}/edit-feedback/${feedbackId}`);

  const handleDeleteFeedback = async (feedbackId) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await axios.delete(`http://localhost:3000/feedback/${feedbackId}`, { withCredentials: true });
      setFeedbacks(feedbacks.filter(fb => fb._id !== feedbackId));
    } catch {
      alert('Failed to delete feedback.');
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!event) return <div className="text-center py-10 text-gray-600">No event found.</div>;

  // Event type to icon mapping
  const eventTypeIcons = {
    Hackathon: <BrainCircuit className="text-indigo-500 w-7 h-7" title="Hackathon" />,
    Workshop: <Hammer className="text-green-500 w-7 h-7" title="Workshop" />,
    Seminar: <BookOpen className="text-blue-500 w-7 h-7" title="Seminar" />,
    Quiz: <Award className="text-yellow-500 w-7 h-7" title="Quiz" />,
    Conference: <Users2 className="text-purple-500 w-7 h-7" title="Conference" />,
    "Case Study": <HelpCircle className="text-pink-500 w-7 h-7" title="Case Study" />,
    "Creative Showcase": <Palette className="text-orange-500 w-7 h-7" title="Creative Showcase" />,
    Other: <CalendarIcon className="text-gray-400 w-7 h-7" title="Other" />,
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 min-h-screen font-[Poppins] relative overflow-x-hidden">
      {/* Optional: Add a subtle background pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 z-0 dark:opacity-20" style={{background: 'radial-gradient(circle at 60% 40%, #a5b4fc 0%, transparent 70%)'}}></div>
      <Navbar />
      <div className="max-w-5xl mx-auto pt-32 pb-10 px-4 relative z-10">
        <div className="bg-white/95 dark:bg-gray-900/90 border border-blue-100 dark:border-gray-700 rounded-3xl shadow-xl p-8 md:p-12 mb-10 relative overflow-hidden">
          {/* Event type icon and accent */}
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-full bg-blue-100 dark:bg-gray-800 p-3 shadow">
              {eventTypeIcons[event.eventType] || eventTypeIcons.Other}
            </div>
            <span className="text-base font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              {event.eventType || 'Event'}
            </span>
          </div>
          <div><h1 className="text-4xl md:text-5xl font-extrabold mb-5 text-indigo-900 dark:text-white tracking-tight text-center drop-shadow-sm">{event.title.toUpperCase()}</h1></div>
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <button onClick={handleEdit} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full px-3 py-2 shadow-md transition text-lg"><PencilIcon /></button>
            <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full px-3 py-2 shadow-md transition text-lg"><Trash /></button>
            <button onClick={() => navigate(`/events/${eventId}/add-feedback`)} className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-3 py-2 shadow-md transition text-lg"><MessageSquarePlus /> </button>
          </div>
          <p className="text-gray-700 dark:text-white mb-6 italic max-w-xl mx-auto text-center text-lg">{event.description}</p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 text-base text-gray-800 dark:text-gray-200">
            <div className="flex items-center gap-3"><span className="bg-blue-100 dark:bg-gray-800 p-2 rounded-full"><CalendarDays size={22} className="text-indigo-500" /></span> {new Date(event.date).toLocaleString()}</div>
            {event.venue && <div className="flex items-center gap-3"><span className="bg-blue-100 dark:bg-gray-800 p-2 rounded-full"><MapPin size={22} className="text-indigo-500" /></span> {event.venue}</div>}
            <div className="flex items-center gap-3"><span className="bg-blue-100 dark:bg-gray-800 p-2 rounded-full"><UserCircle size={22} className="text-indigo-500" /></span> {event.createdBy?.name || 'Unknown Creator'}</div>
            <div className="flex items-center gap-3"><span className="bg-blue-100 dark:bg-gray-800 p-2 rounded-full"><Users size={22} className="text-indigo-500" /></span> {event.registeredUsers ? event.registeredUsers.length : 0} Participants</div>
            {event.eventType && <div className="flex items-center gap-3"><span className="bg-blue-100 dark:bg-gray-800 p-2 rounded-full"><Tag size={22} className="text-indigo-500" /></span> {event.eventType}</div>}
            {event.mode !== undefined && <div className="flex items-center gap-3"><span className="bg-blue-100 dark:bg-gray-800 p-2 rounded-full"><Globe size={22} className="text-indigo-500" /></span> {event.mode ? 'Online Event' : 'Offline Event'}</div>}
            {event.registrationEnd && <div className="flex items-center gap-3"><span className="bg-blue-100 dark:bg-gray-800 p-2 rounded-full"><CalendarDays size={22} className="text-indigo-500" /></span> Reg. Deadline: {new Date(event.registrationEnd).toLocaleDateString()}</div>}
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-2">Tags:</h2>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, idx) => (
                  <span key={idx} className="bg-blue-100 dark:bg-gray-800 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-xs">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Media */}
          {/*
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">Media:</h2>
            <div className="flex flex-wrap gap-3">
              {event.media && event.media.length > 0 ? event.media.map((m, i) => (
                m.type === 'image' ? (
                  <div key={i} className="relative group">
                    <img src={m.url} alt="event media" className="w-28 h-28 object-cover rounded-lg border hover:scale-105 transition-transform duration-200" />
                    <ImageIcon className="absolute top-1 right-1 text-white bg-black bg-opacity-50 rounded-full p-0.5" size={16} />
                  </div>
                ) : (
                  <div key={i} className="relative group">
                    <video src={m.url} controls className="w-28 h-28 rounded-lg border hover:scale-105 transition-transform duration-200" />
                    <Video className="absolute top-1 right-1 text-white bg-black bg-opacity-50 rounded-full p-0.5" size={16} />
                  </div>
                )
              )) : (
                <span className="text-gray-500">No media available for this event.</span>
              )}
            </div>
          </div>
          */}

          {/* Divider */}
          <div className="border-t border-blue-100 dark:border-gray-700 my-8"></div>

          {/* Feedback Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700 dark:text-indigo-400 text-center">User Feedbacks</h2>
            {feedbacks.length ? (
              <ul className="space-y-4">
                {feedbacks.map(fb => (
                  <li key={fb._id} className="p-4 bg-blue-50 dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-gray-700 shadow flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <span className="font-semibold text-indigo-700 dark:text-indigo-300">{fb.user?.username || 'Anonymous'}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-300 ml-2">{new Date(fb.createdAt).toLocaleString()}</span>
                      <p className="text-gray-700 dark:text-white mt-1">{fb.review}</p>
                      <p className="text-sm text-indigo-600 dark:text-indigo-300 font-bold">Rating: <span className="text-yellow-500">{fb.rating}/5</span></p>
                    </div>
                    {user && fb.user && fb.user._id === user._id && (
                      <div className="flex gap-2 mt-2 md:mt-0">
                        <button onClick={() => handleDeleteFeedback(fb._id)} className="text-red-600 hover:underline">Delete</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 dark:text-gray-300 text-center">No user feedback yet.</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetails;
