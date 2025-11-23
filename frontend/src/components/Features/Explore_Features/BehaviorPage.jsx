import React from 'react';
import { Brain } from 'lucide-react';

/*
  Component: BehaviorPage
  Purpose:
    - Overview page that presents high-level user behavior insights.
    - This is a presentational component showing sections such as
      `Click Paths` and `Feature Usage` as cards. Data / charts should
      be provided by parent components or added here later.

  Structure:
    - Page container with a dark gradient background for contrast.
    - Header area with an icon and title.
    - Intro paragraph describing the page goal.
    - Grid of cards (two columns on md+ screens) for specific metrics.

  Notes for developers:
    - Keep this component UI-only. Connect to analytics data via props
      or a data-fetching hook (e.g., `useEffect` + `axios`) when integrating.
    - For accessibility, any interactive cards added later should be
      keyboard-focusable and announce their purpose to screen readers.
*/

const BehaviorPage = () => {
  return (
    // Full-screen section with padding; background set via Tailwind classes
    <div className="min-h-screen w-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header: icon + title */}
        <div className="flex items-center gap-4 text-green-400 mb-6">
          <Brain size={28} />
          <h1 className="text-4xl font-bold">User Behavior</h1>
        </div>

        {/* Short intro describing the page intent */}
        <p className="text-gray-300 mb-10 text-lg">
          Understand how users interact with your events and which features they use the most.
        </p>

        {/* Grid of cards: expand these into interactive charts or lists as needed */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Card: Click Paths - placeholder for a click-path visualization */}
          <div className="bg-[#1e1b3a] p-6 rounded-xl shadow-lg hover:bg-[#2d295c]">
            <h2 className="text-xl text-green-300 font-semibold mb-2">Click Paths</h2>
            <p className="text-gray-300 text-sm">Track user journeys through different event sections.</p>
          </div>

          {/* Card: Feature Usage - placeholder for a usage breakdown */}
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