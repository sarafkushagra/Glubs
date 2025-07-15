import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventNavbar from './EventNavbar';
import Footer from '../Pages/Footer';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/event/${eventId}`);
        setEvent(res.data.event); // ✅ CORRECT: extracting event
        setFeedbacks(res.data.feedbacks); // ✅ CORRECT: extracting feedbacks
      } catch (error) {
        console.error(error);
        setError("Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`http://localhost:3000/event/${eventId}`, { method: 'DELETE' });
      if (res.ok) {
        navigate('/events');
      } else {
        alert('Failed to delete event');
      }
    } catch (err) {
      alert('Error deleting event');
    }
  };

  const handleEdit = () => {
    navigate(`/events/edit/${eventId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!event) return <div>No event found.</div>;

  return (
    <>
    <EventNavbar />
    <div className="max-w-4xl mx-auto mt-30 p-6 bg-purple-50 rounded shadow mb-10">
      <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
      <p className="text-gray-700 mb-4">{event.description}</p>
      <div className="mb-2"><b>Type:</b> {event.eventType}</div>
      <div className="mb-2"><b>Date:</b> {new Date(event.date).toLocaleString()}</div>
      <div className="mb-2"><b>Venue:</b> {event.venue}</div>
      <div className="mb-2"><b>Created By:</b> {event.createdBy?.name || event.createdBy}</div>
      <div className="mb-4">
        <b>Media:</b>
        <div className="flex gap-2 mt-2">
          {event.media && event.media.length > 0 ? event.media.map((m, i) => (
            m.type === 'image' ? (
              <img key={i} src={m.url} alt="event media" className="w-24 h-24 object-cover rounded" />
            ) : (
              <video key={i} src={m.url} controls className="w-24 h-24 rounded" />
            )
          )) : 'No media'}
        </div>
      </div>
      <div className="flex gap-4 mb-6">
        <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Edit</button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
      </div>

      {/* REMOVE DUPLICATE FEEDBACK */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Feedback</h2>
        {feedbacks.length > 0 ? (
          <ul className="space-y-2">
            {feedbacks.map((fb, idx) => (
              <li key={idx} className="p-3 bg-gray-100 rounded shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-blue-700">
                    {fb.user?.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(fb.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-800">{fb.review}</p>
                <p className="text-yellow-600 text-sm">Rating: {fb.rating}/5</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No feedback yet.</p>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default EventDetails;
