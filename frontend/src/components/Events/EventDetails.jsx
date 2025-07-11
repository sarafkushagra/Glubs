import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
          const fetchData = async () => {
              try {
                  const res = await axios.get("http://localhost:3000/event"); 
                  console.log(res);// Change port if needed
                  // setEvent(Array.isArray(res.data) ? res.data : []);
              } catch (error) {
                  console.error(error);
              }
          };
          fetchData();
      }, []);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
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
    navigate(`/event/edit/${eventId}`);
  };

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;
  // if (!event) return <div>No event found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
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
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Feedback</h2>
        {event.feedback ? (
          <div className="bg-gray-100 p-3 rounded">{event.feedback}</div>
        ) : (
          <div>No feedback yet.</div>
        )}
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        {event.comments && event.comments.length > 0 ? (
          <ul>
            {event.comments.map((c, i) => (
              <li key={i} className="mb-2 border-b pb-2">
                <b>{c.user?.name || c.user}:</b> {c.text} <span className="text-xs text-gray-500">({new Date(c.timestamp).toLocaleString()})</span>
              </li>
            ))}
          </ul>
        ) : (
          <div>No comments yet.</div>
        )}
      </div>
    </div>
  );
};

export default EventDetails; 