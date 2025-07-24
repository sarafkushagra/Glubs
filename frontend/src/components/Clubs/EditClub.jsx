import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Pages/Footer';
import Navbar from '../Pages/Navbar';

const EditClub = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await axios.get(`${process.env.API_BASE_URL}/clubs/${clubId}`);
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
      const res = await axios.put(`${process.env.API_BASE_URL}/clubs/${clubId}`, form, {
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-800 relative">
      <Navbar />
      <div className="container mx-auto px-4 py-10 pt-28 relative z-10 min-h-[calc(100vh-80px)] flex flex-1 items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="mb-8 text-left">
            <h1 className="text-4xl font-extrabold text-white mb-8 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Edit Club
            </h1>
            <div className="bg-gray-900/60 backdrop-blur-lg shadow-xl rounded-md p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block font-semibold mb-2 text-indigo-200" style={{ fontFamily: 'Poppins, sans-serif' }}>Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-indigo-700 bg-gray-900 text-white rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
                    required
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-indigo-200" style={{ fontFamily: 'Poppins, sans-serif' }}>Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full h-40 p-3 border border-indigo-700 bg-gray-900 text-white rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  />
                </div>
                <button
                  type="submit"
                  className="border border-indigo-400 text-indigo-200 bg-transparent rounded-md px-6 py-2 font-medium text-base transition-all duration-200 hover:bg-indigo-900/30 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Update Club
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditClub; 