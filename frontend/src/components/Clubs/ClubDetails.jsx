import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Pages/Footer';
import Navbar from '../Pages/Navbar';

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
        console.log("Fetched club details:", res.data.events);
        setEvents(res.data.events || []);
      } catch (err) {
        setError('Failed to fetch club details');
      } finally {
        setLoading(false);
      }
    };
    fetchClub();
  }, [clubId]);

   useEffect(() => {
      const fetchEvents = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/clubs/${clubId}/events`);
          setEvents(res.data || []);
        } catch (err) {
          setError('Failed to fetch events');
        } finally {
          setLoading(false);
        }
      };
      fetchEvents();
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
    <div className="bg-gradient-to-b from-indigo-900 via-purple-50 to-white min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto pt-30 pb-10 p-8">
        <h1 className="text-4xl font-extrabold mb-2 text-gray-900 tracking-tight">{club.name}</h1>
        <p className="mb-8 text-gray-700 italic text-lg">{club.description}</p>
        <div className="flex flex-wrap gap-4 mb-12">
          <Link to={`/clubs/edit/${club._id}`} className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-semibold rounded-full px-7 py-3 shadow-lg hover:scale-105 hover:from-indigo-700 hover:to-purple-600 transition-all duration-300 border-none">Edit Club</Link>
          <Link to={`/clubs/${club._id}/members`} className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-semibold rounded-full px-7 py-3 shadow-lg hover:scale-105 hover:from-indigo-700 hover:to-purple-600 transition-all duration-300 border-none">View Members</Link>
          <Link to={`/clubs/${club._id}/events`} className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-semibold rounded-full px-7 py-3 shadow-lg hover:scale-105 hover:from-indigo-700 hover:to-purple-600 transition-all duration-300 border-none">View Events</Link>
          <button onClick={handleDelete} className="bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-full px-7 py-3 shadow-lg hover:scale-105 hover:from-red-600 hover:to-red-800 transition-all duration-300 border-none">Delete Club</button>
        </div>
        <div className="border-t border-indigo-100 my-10"></div>
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Events Organized by {club.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {events.length > 0 ? events.map(event => (
            <Link to={`/events/${event._id}`} key={event._id} className="block bg-white rounded-2xl shadow-xl border border-indigo-100 hover:border-indigo-400 p-7 hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2">
              <h3 className="text-xl font-bold mb-1 group-hover:text-indigo-700 transition">{event.title}</h3>
              <p className="text-gray-600 line-clamp-2">{event.description}</p>
              <div className="text-sm text-gray-500 mt-2">{new Date(event.date).toLocaleString()}</div>
              <span className="inline-block mt-2 text-xs text-indigo-500 font-semibold group-hover:underline">View Event →</span>
            </Link>
          )) : <div className="col-span-2 text-center text-gray-500">No events found for this club.</div>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClubDetails; 