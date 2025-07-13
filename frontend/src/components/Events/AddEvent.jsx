import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddEvent = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    eventType: '',
    date: '',
    venue: '',
  });

  const [media, setMedia] = useState([]); // for media URLs or upload later
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setMedia(urls);
    // For actual upload, you will handle File uploads to Cloudinary/your backend here.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, media: media.map(url => ({ type: 'image', url })) };

      const res = await axios.post('http://localhost:3000/event', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status === 201 || res.status === 200) {
        navigate('/events');
      } else {
        alert('Failed to add event');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Add New Event</h1>
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
        <div>
          <label className="block font-semibold mb-1">Media (Optional)</label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaChange}
            className="w-full p-2 border rounded"
          />
          {media.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {media.map((url, i) => (
                <img key={i} src={url} alt="preview" className="w-20 h-20 object-cover rounded" />
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? 'Adding...' : 'Add Event'}
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
