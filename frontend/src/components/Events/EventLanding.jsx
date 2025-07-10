import React, { useState,useEffect } from 'react';
import axios from 'axios';
export default function EventsPage({  }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  
  const [events, setEvent] = useState([]);

  useEffect(() => {
          const fetchData = async () => {
              try {
                  const res = await axios.get("http://localhost:3000/event"); // Change port if needed
                  setEvent(Array.isArray(res.data) ? res.data : []);
              } catch (error) {
                  console.error(error);
              }
          };
          fetchData();
      }, []);
  const filteredEvents = events.filter(event => {
    const searchMatch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase());

    const categoryMatch = category === 'All' || event.eventType === category;

    return searchMatch && categoryMatch;
  });

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <a href="/" className="text-2xl font-bold text-purple-700">Glubs</a>
        <nav className="space-x-4">
          <a href="/" className="text-gray-700 hover:text-purple-700">Home</a>
          <a href="/about" className="text-gray-700 hover:text-purple-700">About</a>
          <a href="/events" className="text-gray-700 hover:text-purple-700">Events</a>
        </nav>
        <a href="/events/new" className="bg-purple-700 text-white px-4 py-2 rounded">Host Event</a>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 bg-white">
        <h1 className="text-5xl font-bold mb-4">Discover Amazing <span className="text-purple-700">College Events</span></h1>
        <p className="text-gray-600 max-w-xl mx-auto">Join hackathons, workshops, conferences, and networking events. Connect with like-minded students and build your future.</p>
      </section>

      {/* Search & Filter Bar */}
      <div className="text-center my-6 space-y-2">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64 max-w-full"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-64 max-w-full"
        >
          <option value="All">All Categories</option>
          <option value="Hackathon">Hackathon</option>
          <option value="Workshop">Workshop</option>
          <option value="Conference">Conference</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Events Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-2 flex flex-col"
            >
              <div className="relative bg-gray-200 h-40 rounded-t-lg flex items-center justify-center text-gray-500">
                {event.eventType && (
                  <span className="absolute top-2 left-2 bg-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.eventType}
                  </span>
                )}
                {event.date && (
                  <span className="absolute top-2 right-2 bg-white px-3 py-1 rounded text-xs">
                    {event.date}
                  </span>
                )}
                {event.media ? (
                  <img
                    src={event.media}
                    alt={event.title}
                    className="object-cover h-full w-full rounded-t-lg"
                  />
                ) : (
                  <span className="text-lg font-semibold">Event Image</span>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold mb-2 text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                <div className="text-xs text-gray-500 mb-2 space-y-1">
                  {event.venue && <p><strong>Location:</strong> {event.venue}</p>}
                  {event.time && <p><strong>Time:</strong> {event.time}</p>}
                </div>
                <a
                  href={`/events/${event._id}`}
                  className="bg-purple-700 text-white text-center block py-2 rounded hover:bg-purple-800 transition mt-auto"
                >
                  View Details
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No events found matching your criteria.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-auto">
        <div className="text-lg font-bold mb-2">Glubs</div>
        <p className="text-gray-400">Connecting students through amazing college events</p>
        <p className="text-gray-500 text-sm mt-1">&copy; 2025 Glubs. All rights reserved.</p>
      </footer>
    </div>
  );
}
