import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    eventType: '',
    date: '',
    venue: '',
    feedback: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch event details to prefill form
    fetch(`/api/events/${eventId}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          title: data.title || '',
          description: data.description || '',
          eventType: data.eventType || '',
          date: data.date ? data.date.slice(0, 16) : '', // for datetime-local
          venue: data.venue || '',
          feedback: data.feedback || '',
        });
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load event');
        setLoading(false);
      });
  }, [eventId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        navigate(`/event/${eventId}`);
      } else {
        alert('Failed to update event');
      }
    } catch (err) {
      alert('Error updating event');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Type</label>
          <select name="eventType" value={form.eventType} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="">Select type</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Date & Time</label>
          <input type="datetime-local" name="date" value={form.date} onChange={handleChange} className="w-full p-2 border rounded" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Venue</label>
          <input name="venue" value={form.venue} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Feedback</label>
          <textarea name="feedback" value={form.feedback} onChange={handleChange} className="w-full p-2 border rounded" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent; 