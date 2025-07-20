import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Pages/Footer';
import Navbar from '../Pages/Navbar';

const ClubEvents = () => {
  const { clubId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="bg-gradient-to-b from-indigo-900 via-purple-50 to-white min-h-screen">
      <Navbar />
      <div className="max-w-5xl pt-30 pb-10 mx-auto p-8">
        <h1 className="text-2xl font-extrabold mb-8 text-indigo-700">Events for this Club</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {events.length > 0 ? events.map(event => (
            <Link to={`/event/${event._id}`} key={event._id} className="block bg-white rounded-2xl shadow-xl border border-indigo-100 hover:border-indigo-400 p-7 hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-2">
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

export default ClubEvents; 