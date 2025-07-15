import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

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
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold mb-6 text-indigo-700">Events for this Club</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events.length > 0 ? events.map(event => (
          <Link to={`/event/${event._id}`} key={event._id} className="block bg-white rounded-xl shadow p-6 hover:shadow-2xl transition border border-gray-100 hover:border-indigo-400 group">
            <h3 className="text-xl font-semibold mb-1 group-hover:text-indigo-600 transition">{event.title}</h3>
            <p className="text-gray-600 line-clamp-2">{event.description}</p>
            <div className="text-sm text-gray-500 mt-2">{new Date(event.date).toLocaleString()}</div>
          </Link>
        )) : <div className="col-span-2 text-center text-gray-500">No events found for this club.</div>}
      </div>
    </div>
  );
};

export default ClubEvents; 