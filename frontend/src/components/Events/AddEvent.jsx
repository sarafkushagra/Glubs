import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Pages/Footer';
import Navbar from '../Pages/Navbar';

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
    <div className="bg-gradient-to-b from-indigo-900 via-purple-50 to-white min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto pt-30 pb-10 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-10">
          <h1 className="text-2xl font-extrabold mb-8 text-indigo-700">Add New Event</h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block font-semibold mb-2 text-indigo-700">Title</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-700" required />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-indigo-700">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-2xl shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-700" />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-indigo-700">Type</label>
              <select name="eventType" value={form.eventType} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-700" required>
                <option value="">Select type</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2 text-indigo-700">Date & Time</label>
              <input type="datetime-local" name="date" value={form.date} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-700" required />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-indigo-700">Venue</label>
              <input name="venue" value={form.venue} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-700" />
            </div>
            <button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-semibold rounded-full px-7 py-3 shadow-lg hover:scale-105 hover:from-indigo-700 hover:to-purple-600 transition-all duration-300 border-none">Add Event</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddEvent;
