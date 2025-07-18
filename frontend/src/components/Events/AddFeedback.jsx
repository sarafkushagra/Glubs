// src/Events/AddFeedback.jsx

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventNavbar from './EventNavbar';
import Footer from '../Pages/Footer';

const AddFeedback = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ review: '', rating: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(`http://localhost:3000/event/${eventId}/add-feedback`, form, {
        headers: { 'Content-Type': 'application/json' },
      });
      navigate(`/events/${eventId}`);
    } catch (err) {
      console.error(err);
      setError('Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <EventNavbar />
      <div className="max-w-xl mx-auto mt-24 p-6 bg-white rounded shadow mb-10">
        <h1 className="text-2xl font-bold mb-4 text-indigo-700">Add Feedback</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Review</label>
            <textarea
              name="review"
              value={form.review}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
              rows={4}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Rating (1-5)</label>
            <input
              type="number"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              min="1"
              max="5"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition shadow"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddFeedback;
