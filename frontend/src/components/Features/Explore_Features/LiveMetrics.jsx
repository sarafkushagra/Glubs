import React from 'react';

const LiveMetrics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f051d] to-[#1c1444] text-white p-10">
      <h1 className="text-4xl font-bold text-cyan-400 mb-6">Live Metrics</h1>
      <ul className="text-lg space-y-4">
        <li>• Realtime RSVPs</li>
        <li>• Traffic surge alerts</li>
      </ul>
    </div>
  );
};

export default LiveMetrics;
