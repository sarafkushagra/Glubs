import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Pages/Footer';
import Navbar from '../Pages/Navbar';

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!event) return <div>No event found.</div>;

  return (
    <div className="bg-gradient-to-b from-indigo-900 via-purple-50 to-white min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-30 pb-10 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-10 mb-10">
          <h1 className="text-3xl font-extrabold mb-2 text-indigo-700 tracking-tight">{event.title.toUpperCase()}</h1>
          <p className="text-gray-700 mb-4 italic text-lg">{event.description}</p>
          <div className="mb-2 text-indigo-700 font-semibold">Type: <span className="font-normal text-gray-800">{event.eventType}</span></div>
          <div className="mb-2 text-indigo-700 font-semibold">Date: <span className="font-normal text-gray-800">{new Date(event.date).toLocaleString()}</span></div>
          <div className="mb-2 text-indigo-700 font-semibold">Venue: <span className="font-normal text-gray-800">{event.venue}</span></div>
          <div className="mb-2 text-indigo-700 font-semibold">Created By: <span className="font-normal text-gray-800">{event.createdBy?.name || event.createdBy}</span></div>
          <div className="mb-4">
            <b className="text-indigo-700">Media:</b>
            <div className="flex gap-2 mt-2 flex-wrap">
              {event.media && event.media.length > 0 ? event.media.map((m, i) => (
                m.type === 'image' ? (
                  <img key={i} src={m.url} alt="event media" className="w-24 h-24 object-cover rounded-lg border hover:scale-105 transition-transform duration-200" />
                ) : (
                  <video key={i} src={m.url} controls className="w-24 h-24 rounded-lg border hover:scale-105 transition-transform duration-200" />
                )
              )) : <span className="text-gray-500">No media</span>}
            </div>
          </div>
          <div className="flex gap-4 mb-8">
            <button onClick={handleEdit} className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-semibold rounded-full px-7 py-3 shadow-lg hover:scale-105 hover:from-indigo-700 hover:to-purple-600 transition-all duration-300 border-none">Edit</button>
            <button onClick={handleDelete} className="bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-full px-7 py-3 shadow-lg hover:scale-105 hover:from-red-600 hover:to-red-800 transition-all duration-300 border-none">Delete</button>
            <button onClick={() => navigate(`/events/${eventId}/add-feedback`)} className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-full px-7 py-3 shadow-lg hover:scale-105 hover:from-green-600 hover:to-green-800 transition-all duration-300 border-none">Add Feedback</button>
          </div>
          <div className="border-t border-indigo-100 my-8"></div>
          
          {/* Feedbacks Section */}
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
                        <button onClick={() => handleEditFeedback(fb._id)} className="text-indigo-600 hover:underline">Edit</button>
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
