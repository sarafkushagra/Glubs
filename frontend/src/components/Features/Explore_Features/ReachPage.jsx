// ReachPage.jsx
import React from 'react';
import { Globe2 } from 'lucide-react';

const ReachPage = () => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 text-cyan-400 mb-6">
          <Globe2 size={28} />
          <h1 className="text-4xl font-bold">Event Reach</h1>
        </div>
        <p className="text-gray-300 mb-10 text-lg">
          Analyze your event's digital footprint and geographical reach.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#1e1b3a] p-6 rounded-xl shadow-lg hover:bg-[#2d295c]">
            <h2 className="text-xl text-cyan-300 font-semibold mb-2">Audience Location</h2>
            <p className="text-gray-300 text-sm">See from where participants are joining your events.</p>
          </div>
          <div className="bg-[#1e1b3a] p-6 rounded-xl shadow-lg hover:bg-[#2d295c]">
            <h2 className="text-xl text-cyan-300 font-semibold mb-2">Device Breakdown</h2>
            <p className="text-gray-300 text-sm">Find out what devices or browsers are most commonly used.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReachPage;