import React from 'react';
import { Brain } from 'lucide-react';

const BehaviorPage = () => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 text-green-400 mb-6">
          <Brain size={28} />
          <h1 className="text-4xl font-bold">User Behavior</h1>
        </div>
        <p className="text-gray-300 mb-10 text-lg">
          Understand how users interact with your events and which features they use the most.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-[#1e1b3a] p-6 rounded-xl shadow-lg hover:bg-[#2d295c]">
            <h2 className="text-xl text-green-300 font-semibold mb-2">Click Paths</h2>
            <p className="text-gray-300 text-sm">Track user journeys through different event sections.</p>
          </div>
          <div className="bg-[#1e1b3a] p-6 rounded-xl shadow-lg hover:bg-[#2d295c]">
            <h2 className="text-xl text-green-300 font-semibold mb-2">Feature Usage</h2>
            <p className="text-gray-300 text-sm">Identify the most used features and pain points.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehaviorPage;