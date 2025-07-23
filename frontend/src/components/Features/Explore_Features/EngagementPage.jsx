import React from 'react';
import { LineChart } from 'lucide-react';

const EngagementPage = () => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 text-purple-400 mb-6">
          <LineChart size={28} />
          <h1 className="text-4xl font-bold">Engagement Reports</h1>
        </div>
        <p className="text-gray-300 mb-10 text-lg">
          Dive into session engagement metrics and understand participant behavior.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#1e1b3a] p-6 rounded-xl shadow-lg hover:bg-[#2d295c]">
            <h2 className="text-xl text-purple-300 font-semibold mb-2">Top Sessions</h2>
            <p className="text-gray-300 text-sm">View which sessions attracted the most attention.</p>
          </div>
          <div className="bg-[#1e1b3a] p-6 rounded-xl shadow-lg hover:bg-[#2d295c]">
            <h2 className="text-xl text-purple-300 font-semibold mb-2">Avg. Time Per Student</h2>
            <p className="text-gray-300 text-sm">Measure attention span and session duration per user.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementPage;