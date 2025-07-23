import React from 'react';
import { BarChart2 } from 'lucide-react';

const AttendancePage = () => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="flex items-center gap-4 text-blue-400 mb-6">
          <BarChart2 size={28} />
          <h1 className="text-4xl font-bold">Attendance Overview</h1>
        </div>

        {/* Subheading */}
        <p className="text-gray-300 mb-10 text-lg">
          Track total registrations, live check-ins, and dropout trends with interactive insights.
        </p>

        {/* Section 1 - Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#1e1b3a] p-6 rounded-xl shadow-lg hover:bg-[#2d295c] transition duration-300">
            <h2 className="text-xl text-blue-300 font-semibold mb-2">Total Registrations</h2>
            <p className="text-gray-300 text-sm">Displays all sign-ups made before the event.</p>
          </div>
          <div className="bg-[#1e1b3a] p-6 rounded-xl shadow-lg hover:bg-[#2d295c] transition duration-300">
            <h2 className="text-xl text-blue-300 font-semibold mb-2">Active Check-ins</h2>
            <p className="text-gray-300 text-sm">Shows real-time attendees who marked presence.</p>
          </div>
          <div className="bg-[#1e1b3a] p-6 rounded-xl shadow-lg hover:bg-[#2d295c] transition duration-300">
            <h2 className="text-xl text-blue-300 font-semibold mb-2">Dropout Rate</h2>
            <p className="text-gray-300 text-sm">Compare total vs actual participants to identify dropouts.</p>
          </div>
          <div className="bg-[#1e1b3a] p-6 rounded-xl shadow-lg hover:bg-[#2d295c] transition duration-300">
            <h2 className="text-xl text-blue-300 font-semibold mb-2">Live Attendance Graph</h2>
            <p className="text-gray-300 text-sm">Visualize hourly check-in patterns and peak times.</p>
          </div>
        </div>

        {/* Placeholder Chart Area */}
        <div className="bg-[#1e1b3a] p-8 rounded-xl shadow-xl hover:bg-[#2d295c] transition duration-300 mb-20">
          <h3 className="text-2xl font-semibold text-blue-300 mb-4">Real-Time Attendance Trend</h3>
          <div className="w-full h-64 flex items-center justify-center text-gray-400 border border-dashed border-gray-500 rounded-lg">
            {/* Replace this with a chart.js or recharts line graph */}
            [Graph Coming Soon]
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
