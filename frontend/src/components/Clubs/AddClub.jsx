import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ClubNavbar from './ClubNavbar';
import Footer from '../Pages/Footer';

const AddClub = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '' });
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
      const res = await axios.post('http://localhost:3000/clubs', form, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 201 || res.status === 200) {
        navigate('/clubs');
      } else {
        setError('Failed to add club.');
      }
    } catch (err) {
      setError('Error adding club.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <ClubNavbar/>
    <div className="max-w-4xl mx-auto mt-30 mb-10 p-8 bg-purple-50 rounded-xl shadow-lg ">
      <h1 className="text-2xl font-bold mb-6 text-purple-700">Add New Club</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-500 text-white px-6 py-2 rounded shadow hover:bg-purple-600 transition"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Club'}
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
    <Footer/>
    </>
  );
};

export default AddClub; 