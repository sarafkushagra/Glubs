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
  MessageSquarePlus
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

  return (
    <div className="bg-gradient-to-b from-indigo-900 via-purple-50 to-white min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-32 pb-10 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-8 md:p-10 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

            <div><h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-indigo-700 tracking-tight text-center">{event.title.toUpperCase()}</h1></div>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <button onClick={handleEdit} className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-semibold rounded-full px-2 py-2 shadow-lg hover:scale-105 transition"><PencilIcon /></button>
              <button onClick={handleDelete} className="bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-full px-2 py-2 shadow-lg hover:scale-105 transition"><Trash /></button>
              <button onClick={() => navigate(`/events/${eventId}/add-feedback`)} className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-full px-2 py-2 shadow-lg hover:scale-105 transition"><MessageSquarePlus /> </button>
            </div>

          </div>
          <p className="text-gray-700 mb-6 italic max-w-xl">{event.description}</p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
            <div className="flex items-center gap-2"><CalendarDays size={18} className="text-purple-500" /> {new Date(event.date).toLocaleString()}</div>
            {event.venue && <div className="flex items-center gap-2"><MapPin size={18} className="text-purple-500" /> {event.venue}</div>}
            <div className="flex items-center gap-2"><UserCircle size={18} className="text-purple-500" /> {event.createdBy?.name || 'Unknown Creator'}</div>
            <div className="flex items-center gap-2"><Users size={18} className="text-purple-500" /> {event.registeredUsers ? event.registeredUsers.length : 0} Participants</div>
            {event.eventType && <div className="flex items-center gap-2"><Tag size={18} className="text-purple-500" /> {event.eventType}</div>}
            {event.mode !== undefined && <div className="flex items-center gap-2"><Globe size={18} className="text-purple-500" /> {event.mode ? 'Online Event' : 'Offline Event'}</div>}
            {event.registrationEnd && <div className="flex items-center gap-2"><CalendarDays size={18} className="text-purple-500" /> Reg. Deadline: {new Date(event.registrationEnd).toLocaleDateString()}</div>}
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-indigo-700 mb-2">Tags:</h2>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, idx) => (
                  <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Media */}
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


          {/* Divider */}
          <div className="border-t border-indigo-100 my-8"></div>

          {/* Feedback Section (untouched as requested) */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2 text-indigo-700">User Feedbacks</h2>
            {feedbacks.length ? (
              <ul className="space-y-2">
                {feedbacks.map(fb => (
                  <li key={fb._id} className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 shadow flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <span className="font-semibold text-indigo-700">{fb.user?.username || 'Anonymous'}</span>
                      <span className="text-xs text-gray-500 ml-2">{new Date(fb.createdAt).toLocaleString()}</span>
                      <p className="text-gray-700 mt-1">{fb.review}</p>
                      <p className="text-sm text-indigo-600">Rating: {fb.rating}/5</p>
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
              <div className="text-gray-500">No user feedback yet.</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventDetails;
