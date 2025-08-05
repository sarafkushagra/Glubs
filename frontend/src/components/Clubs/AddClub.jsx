import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Pages/Navbar';
import Footer from '../Pages/Footer';

const AddClub = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Academic',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'Sports',
    'Arts',
    'Technology',
    'Environment',
    'Academic',
    'Literature',
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const token = localStorage.getItem('glubsToken');
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/clubs`,
      {
        name: form.name,
        description: form.description,
        category: form.category,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.status === 201) {
      navigate('/clubs');
    } else {
      setError('Failed to add club.');
    }
  } catch (err) {
    console.error('Error adding club:', err.response?.data || err.message);
    setError(err.response?.data?.error || 'Something went wrong.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="bg-gradient-to-b from-indigo-900 via-purple-50 to-white min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-30 pb-10 p-8">
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-10">
          <h1 className="text-2xl font-extrabold mb-8 text-indigo-700">Add New Club</h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Club Name */}
            <div>
              <label className="block font-semibold mb-2 text-indigo-700">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-200 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold mb-2 text-indigo-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full h-40 p-3 border border-gray-200 rounded-2xl shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold mb-2 text-indigo-700">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-200 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-semibold rounded-full px-7 py-3 shadow-lg hover:scale-105 transition-transform duration-300"
            >
              {loading ? 'Adding...' : 'Add Club'}
            </button>

            {/* Error Message */}
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddClub;
