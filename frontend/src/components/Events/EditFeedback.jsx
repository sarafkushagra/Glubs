// src/Events/EditFeedback.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Pages/Footer';
import Navbar from '../Pages/Navbar';

const EditFeedback = () => {
  const { eventId, feedbackId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ review: '', rating: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get(`${process.env.API_BASE_URL}/feedback/${feedbackId}`, { withCredentials: true });
        setForm({ review: res.data.review, rating: res.data.rating });
      } catch (err) {
        console.error(err);
        setError('Failed to load feedback.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [eventId, feedbackId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${process.env.API_BASE_URL}/feedback/${feedbackId}`, form, { withCredentials: true });
      navigate(`/events/${eventId}`);
    } catch (err) {
      console.error(err);
      setError('Failed to update feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-indigo-900 via-purple-50 to-white min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-30 pb-10 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-10">
          <h1 className="text-2xl font-extrabold mb-8 text-indigo-700">Edit Feedback</h1>
          {loading ? <p>Loading...</p> : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block font-semibold mb-2 text-indigo-700">Review</label>
                <textarea name="review" value={form.review} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-2xl shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-700" required rows={4} />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-indigo-700">Rating (1-5)</label>
                <input type="number" name="rating" value={form.rating} onChange={handleChange} min="1" max="5" className="w-full p-3 border border-gray-200 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-700" required />
              </div>
              <button type="submit" className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-full px-7 py-3 shadow-lg hover:scale-105 hover:from-green-600 hover:to-green-800 transition-all duration-300 border-none">Update Feedback</button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditFeedback;
