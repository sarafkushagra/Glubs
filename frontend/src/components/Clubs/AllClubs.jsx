import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Pages/Footer';
import { useState, useEffect } from 'react';
import Navbar from '../Pages/Navbar';

const AllClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get('http://localhost:3000/clubs');
        setClubs(res.data || []);
      } catch (err) {
        setError('Failed to fetch clubs');
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-40">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="bg-gradient-to-b from-indigo-900 via-purple-50 to-white min-h-screen">
      <Navbar />
      <div className="max-w-5xl pt-30 pb-10 mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">All Clubs</h1>
          <button
            onClick={() => navigate('/clubs/add')}
            className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-semibold rounded-full px-7 py-3 shadow-lg hover:scale-105 hover:from-indigo-700 hover:to-purple-600 transition-all duration-300 border-none"
          >
            + Add Club
          </button>
        </div>
        <div className="mb-14 flex justify-center">
          <input
            type="text"
            placeholder="Search clubs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-gray-200 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-700 placeholder-gray-400"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {filteredClubs.length > 0 ? filteredClubs.map((club) => (
            <Link
              to={`/clubs/${club._id}`}
              key={club._id}
              className="block bg-white rounded-2xl shadow-xl border border-indigo-100 hover:border-indigo-400 p-7 hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2"
            >
              <h2 className="text-2xl font-bold mb-2 group-hover:text-indigo-700 transition">{club.name}</h2>
              <p className="text-gray-600 line-clamp-3 mb-2">{club.description}</p>
              <span className="inline-block mt-2 text-xs text-indigo-500 font-semibold group-hover:underline">View Details →</span>
            </Link>
          )) : (
            <div className="col-span-3 text-center text-gray-500">No clubs found.</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllClubs; 