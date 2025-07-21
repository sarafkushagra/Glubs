import React from 'react';
import {
  BarChart2,
  LineChart,
  Brain,
  CalendarDays,
  MessageCircle,
  ActivitySquare,
  TrendingUp,
  Globe2,
  Users
} from 'lucide-react';

const EventAnalytics = () => {
  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto py-16 px-6">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-10 text-center drop-shadow-xl tracking-wide">
          Unlock Real-Time Event Intelligence
        </h1>

        {/* Subheading */}
        <p className="text-lg text-gray-300 mb-14 text-center max-w-2xl mx-auto">
          Get a bird’s-eye view of all event activities, audience engagement, behavior insights, and much more with our dynamic analytics dashboard.
        </p>

        {/* Analytics Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Attendance */}
          <div className="bg-[#1e1b3a] hover:bg-[#2d295c] shadow-2xl p-6 rounded-2xl transition duration-300">
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <BarChart2 size={24} />
              <h2 className="text-xl font-semibold">Attendance Overview</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
              <li>Total & active registrations</li>
              <li>Live check-ins & dropout data</li>
            </ul>
          </div>

          {/* Engagement */}
          <div className="bg-[#1e1b3a] hover:bg-[#2d295c] shadow-2xl p-6 rounded-2xl transition duration-300">
            <div className="flex items-center gap-3 mb-4 text-purple-400">
              <LineChart size={24} />
              <h2 className="text-xl font-semibold">Engagement Reports</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
              <li>Top engaged sessions</li>
              <li>Avg. time per student</li>
            </ul>
          </div>

          {/* User Behavior */}
          <div className="bg-[#1e1b3a] hover:bg-[#2d295c] shadow-2xl p-6 rounded-2xl transition duration-300">
            <div className="flex items-center gap-3 mb-4 text-green-400">
              <Brain size={24} />
              <h2 className="text-xl font-semibold">User Behavior</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
              <li>Click heatmaps</li>
              <li>Device & browser trends</li>
            </ul>
          </div>

          {/* Event Reach */}
          <div className="bg-[#1e1b3a] hover:bg-[#2d295c] shadow-2xl p-6 rounded-2xl transition duration-300">
            <div className="flex items-center gap-3 mb-4 text-cyan-400">
              <Globe2 size={24} />
              <h2 className="text-xl font-semibold">Event Reach</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
              <li>Campus-wise coverage</li>
              <li>Social shares & traffic sources</li>
            </ul>
          </div>

          {/* Feedback */}
          <div className="bg-[#1e1b3a] hover:bg-[#2d295c] shadow-2xl p-6 rounded-2xl transition duration-300">
            <div className="flex items-center gap-3 mb-4 text-pink-400">
              <MessageCircle size={24} />
              <h2 className="text-xl font-semibold">Feedback Insights</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
              <li>Instant ratings & reviews</li>
              <li>Improvement suggestions</li>
            </ul>
          </div>

          {/* Timeline */}
          <div className="bg-[#1e1b3a] hover:bg-[#2d295c] shadow-2xl p-6 rounded-2xl transition duration-300">
            <div className="flex items-center gap-3 mb-4 text-yellow-400">
              <CalendarDays size={24} />
              <h2 className="text-xl font-semibold">Event Timeline</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
              <li>Session-wise milestones</li>
              <li>Live vs upcoming events</li>
            </ul>
          </div>

          {/* Live Metrics */}
          <div className="bg-[#1e1b3a] hover:bg-[#2d295c] shadow-2xl p-6 rounded-2xl transition duration-300">
            <div className="flex items-center gap-3 mb-4 text-teal-400">
              <ActivitySquare size={24} />
              <h2 className="text-xl font-semibold">Live Metrics</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
              <li>Realtime RSVPs</li>
              <li>Traffic surge alerts</li>
            </ul>
          </div>

          {/* Growth */}
          <div className="bg-[#1e1b3a] hover:bg-[#2d295c] shadow-2xl p-6 rounded-2xl transition duration-300">
            <div className="flex items-center gap-3 mb-4 text-orange-400">
              <TrendingUp size={24} />
              <h2 className="text-xl font-semibold">Growth Analysis</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
              <li>Audience growth trend</li>
              <li>Month-wise activity</li>
            </ul>
          </div>

          {/* Demographics */}
          <div className="bg-[#1e1b3a] hover:bg-[#2d295c] shadow-2xl p-6 rounded-2xl transition duration-300">
            <div className="flex items-center gap-3 mb-4 text-indigo-400">
              <Users size={24} />
              <h2 className="text-xl font-semibold">User Demographics</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 text-sm">
              <li>Course & year data</li>
              <li>Gender & participation ratio</li>
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-16 text-center">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-500 hover:to-blue-600 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg transition duration-300">
            View Full Analytics Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;
