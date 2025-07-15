import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventNavbar from './EventNavbar';
import Footer from '../Pages/Footer';

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    eventType: '',
    date: '',
    venue: '',
    // feedback removed
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/event/${eventId}`);
        const data = res.data.event; // ✅ extract event only

        setForm({
          title: data.title || '',
          description: data.description || '',
          eventType: data.eventType || '',
          date: data.date ? new Date(data.date).toISOString().slice(0, 16) : '',
          venue: data.venue || '',
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load event.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:3000/event/${eventId}`, form, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 200) {
        navigate(`/events/${eventId}`);
      } else {
        alert('Failed to update event.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating event.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <EventNavbar />
    <div className="max-w-4xl mx-auto p-6 mt-30 mb-10 bg-purple-50 rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Type</label>
          <select
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select type</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Date & Time</label>
          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Venue</label>
          <input
            name="venue"
            value={form.venue}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Event
        </button>
      </form>
    </div>
    <Footer />
    </>
  );
};

export default EditEvent;
