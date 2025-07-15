import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditClub = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/clubs/${clubId}`);
        setForm({
          name: res.data.name || '',
          description: res.data.description || '',
        });
      } catch (err) {
        setError('Failed to load club details');
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [clubId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:3000/clubs/${clubId}`, form, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.status === 200) {
        navigate(`/clubs/${clubId}`);
      } else {
        alert('Failed to update club.');
      }
    } catch (err) {
      alert('Error updating club.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Edit Club</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600 transition"
        >
          Update Club
        </button>
      </form>
    </div>
  );
};

export default EditClub; 