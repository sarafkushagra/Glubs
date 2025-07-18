import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import EventNavbar from './EventNavbar';
import Footer from '../Pages/Footer';

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

  // const handleRegister = async (eventId) => {
  //   try {
  //     const res = await axios.post(
  //       `http://localhost:3000/event/${eventId}/register`,
  //       {},
  //       { withCredentials: true }
  //     );
  //     alert(res.data.message || "Successfully registered!");
  //   } catch (error) {
  //     console.error("Error registering for event:", error);
  //     console.log(eventId);
  //     alert(error.response?.data?.message || "Failed to register.");
  //   }
  // };


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
    <div className="bg-purple-100 min-h-screen flex flex-col">
      <EventNavbar />

      {/* Hero */}
      <section className="text-center mt-20 py-10 ">
        <h1 className="text-4xl font-bold mb-2">Glubs University Events</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Discover and join exciting hackathons, workshops, and student-run activities!
        </p>
      </section>

      {/* Filter Bar */}
      <div className="flex flex-wrap justify-center gap-4 py-4 my-4">
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
      <div className="flex flex-wrap justify-center gap-4 px-4 pb-4 mb-6">
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
      <div className="pb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-purple-100"
            >
              <div className="relative h-48 bg-gray-100 rounded-t-xl overflow-hidden">
                {event.media && event.media.length > 0 ? (
                  <img
                    src={event.media[0].url}
                    alt="event media"
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
                <span className="absolute top-2 left-2 bg-purple-600 text-white px-3 py-1 text-xs rounded-full">
                  {event.eventType}
                </span>
                <span className="absolute top-2 right-2 bg-white px-3 py-1 text-xs rounded-full border">
                  {dayjs(event.date).format('MMM D, YYYY')}
                </span>
              </div>
              <div className="p-4 flex flex-col justify-between h-56">
                <div>
                  <h3 className="text-lg font-bold text-purple-800 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.description.length > 100 ? event.description.slice(0, 100) + "..." : event.description}
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Venue:</strong> {event.venue || "TBA"}</p>
                    <p><strong>Time:</strong> {event.time || "TBA"}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <a
                    href={`/events/${event._id}`}
                    className="flex-1 bg-purple-600 text-white text-center py-2 rounded hover:bg-purple-700 text-sm transition"
                  >
                    View Details
                  </a>
                  <button
                    onClick={() => handleRegister(event._id)}
                    className="flex-1 bg-green-600 text-white text-center py-2 rounded hover:bg-green-700 text-sm transition"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">No events found.</p>
        )}
      </div>


      {/* Footer */}
      <Footer />
    </div>
  );
}
