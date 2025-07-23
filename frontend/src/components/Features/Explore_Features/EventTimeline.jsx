import React from 'react';

const EventTimeline = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f051d] to-[#1c1444] text-white p-10">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">Event Timeline</h1>
      <ul className="text-lg space-y-4">
        <li>• Session-wise milestones</li>
        <li>• Live vs upcoming events</li>
      </ul>
    </div>
  );
};

export default EventTimeline;
