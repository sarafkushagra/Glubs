import React from 'react';

const EventAnalytics = () => {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6 text-center">Event Analytics</h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        Gain real-time insights into event performance with our integrated analytics dashboard.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-indigo-600 mb-2">📊 Attendance Overview</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Total registered participants</li>
            <li>Live check-in stats</li>
            <li>No-shows and dropouts</li>
          </ul>
        </div>
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-indigo-600 mb-2">📈 Engagement Reports</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Average session time</li>
            <li>Feedback ratings</li>
            <li>Most active sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;
