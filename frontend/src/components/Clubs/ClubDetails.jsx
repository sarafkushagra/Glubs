import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ClubDetails = () => {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/clubs/${clubId}`);
        setClub(res.data);
        setEvents(res.data.events || []);
      } catch (err) {
        setError('Failed to fetch club details');
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [clubId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!club) return <div>Club not found.</div>;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;
    try {
      const res = await axios.delete(`http://localhost:3000/clubs/${clubId}`);
      if (res.status === 200) {
        navigate('/clubs');
      } else {
        alert('Failed to delete club.');
      }
    } catch (err) {
      alert('Error deleting club.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 text-green-700">{club.name}</h1>
      <p className="mb-4 text-gray-700 italic">{club.description}</p>
      <div className="flex flex-wrap gap-4 mb-8">
        <Link to={`/clubs/edit/${club._id}`} className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition">Edit Club</Link>
        <Link to={`/clubs/${club._id}/members`} className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition">View Members</Link>
        <Link to={`/clubs/${club._id}/events`} className="bg-indigo-500 text-white px-4 py-2 rounded shadow hover:bg-indigo-600 transition">View Events</Link>
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition">Delete Club</button>
      </div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Events Organized by {club.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length > 0 ? events.map(event => (
          <Link to={`/event/${event._id}`} key={event._id} className="block bg-white rounded-xl shadow-lg p-5 hover:shadow-2xl transition border border-gray-100 hover:border-green-400 group">
            <h3 className="text-xl font-semibold mb-1 group-hover:text-green-600 transition">{event.title}</h3>
            <p className="text-gray-600 line-clamp-2">{event.description}</p>
            <div className="text-sm text-gray-500 mt-2">{new Date(event.date).toLocaleString()}</div>
          </Link>
        )) : <div className="col-span-2 text-center text-gray-500">No events found for this club.</div>}
      </div>
    </div>
  );
};

export default ClubDetails; 