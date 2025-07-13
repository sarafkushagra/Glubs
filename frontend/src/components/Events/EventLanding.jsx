import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [filterTab, setFilterTab] = useState('All'); // New tab state
  const [events, setEvent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/event');
        setEvent(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Helper functions
  const isUpcoming = (date) => dayjs(date).isAfter(dayjs());
  const isPast = (date) => dayjs(date).isBefore(dayjs());

  const filteredEvents = events.filter((event) => {
    const searchMatch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase());

    const categoryMatch = category === 'All' || event.eventType === category;

    const dateMatch =
      filterTab === 'Upcoming'
        ? isUpcoming(event.date)
        : filterTab === 'Past'
          ? isPast(event.date)
          : true;

    return searchMatch && categoryMatch && dateMatch;
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
        <a href="/events/add" className="bg-purple-700 text-white px-4 py-2 rounded">Add Event</a>
      </header>

      {/* Hero */}
      <section className="text-center py-12 bg-white">
        <h1 className="text-4xl font-bold mb-2">Glubs University Events</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Discover and join exciting hackathons, workshops, and student-run activities!
        </p>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-wrap justify-center gap-4 my-4">
        {['All', 'Upcoming', 'Past'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 rounded ${filterTab === tab
                ? 'bg-purple-700 text-white'
                : 'bg-white text-purple-700 border border-purple-700'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search & Category */}
      <div className="flex flex-wrap justify-center gap-4 px-4 mb-6">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-64"
        >
          <option value="All">All Categories</option>
          <option value="Hackathon">Hackathon</option>
          <option value="Workshop">Workshop</option>
          <option value="Conference">Conference</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1">
              <div className="relative h-40 bg-gray-200 rounded-t-lg overflow-hidden">
                {event.media && event.media.length > 0 ? event.media.map((m, i) => (
                  m.type === 'image' ? (
                    <img key={i} src={m.url} alt="event media" className="w-full h-full object-contain object-center rounded" />
                  ) : (
                    <video key={i} src={m.url} controls className="w-24 h-24 rounded" />
                  )
                )) : 'No media'}
                <span className="absolute top-2 left-2 bg-purple-700 text-white px-3 py-1 text-xs rounded-full">
                  {event.eventType}
                </span>
                <span className="absolute top-2 right-2 bg-white px-3 py-1 text-xs rounded">
                  {dayjs(event.date).format('MMM D')}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.description.slice(0, 80)}...</p>
                <div className="text-xs text-gray-600 mt-2">
                  <p><strong>Location:</strong> {event.venue}</p>
                  <p><strong>Time:</strong> {event.time}</p>
                </div>
                <a
                  href={`/events/${event._id}`}
                  className="block text-center bg-purple-700 text-white py-2 mt-4 rounded hover:bg-purple-800"
                >
                  View Details
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">No events found.</p>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-auto">
        <div className="text-lg font-bold mb-2">Glubs</div>
        <p className="text-gray-400">Connecting students through events & opportunities</p>
        <p className="text-sm mt-2 text-gray-500">&copy; 2025 Glubs. All rights reserved.</p>
      </footer>
    </div>
  );
}
