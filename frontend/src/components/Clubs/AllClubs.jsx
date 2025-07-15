import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ClubNavbar from './ClubNavbar';
import Footer from '../Pages/Footer';

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
    <>
    <div className='bg-purple-50'>
    <ClubNavbar />
    <div className="max-w-5xl mt-20 mx-auto p-6">
      
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search clubs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>
      <div className="grid  grid-cols-1 md:grid-cols-3 gap-8">
        {filteredClubs.length > 0 ? filteredClubs.map((club) => (
          <Link
            to={`/clubs/${club._id}`}
            key={club._id}
            className="block bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition border border-gray-100 hover:border-purple-400 group"
          >
            <h2 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition">{club.name}</h2>
            <p className="text-gray-600 line-clamp-3">{club.description}</p>
          </Link>
        )) : (
          <div className="col-span-3 text-center text-gray-500">No clubs found.</div>
        )}
      </div>
    </div>
    <Footer />
    </div>
    </>
  );
};

export default AllClubs; 