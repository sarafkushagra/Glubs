// src/Pages/Organizers.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Organizers = () => {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4 text-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">Host Impactful Campus Events</h1>
      <p className="text-gray-600 mb-8">
        Reach hundreds of students, manage registrations, and track analytics with ease using GLUBS’ organizer tools.
      </p>

      <div className="grid md:grid-cols-3 gap-6 text-left text-gray-600 mb-12">
        {[
          ['Simple Event Creation', 'Create events with all the details you need in minutes.'],
          ['QR Attendance', 'Use auto-generated QR codes for fast and secure check-ins.'],
          ['Live Analytics', 'Monitor attendance and feedback in real-time.'],
        ].map(([title, desc], idx) => (
          <div key={idx} className="bg-white shadow p-6 rounded-lg">
            <h3 className="text-xl font-bold text-indigo-600 mb-2">{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </div>

      <Link to="/auth" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded text-lg shadow">
        Get Started as Organizer
      </Link>
    </div>
  );
};

export default Organizers;
