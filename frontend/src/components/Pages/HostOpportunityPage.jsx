import React from 'react';
import {
  Rocket,
  Users,
  Lightbulb,
  Star,
  BookOpen,
  ClipboardList,
  Presentation,
} from 'lucide-react';

const opportunitySections = [
  {
    title: 'Engage Brilliant Minds',
    subtitle: 'Host impactful events and challenges for your community or institution.',
    options: [
      { icon: Lightbulb, title: 'Innovation Challenges', action: 'Create Challenge' },
      { icon: Rocket, title: 'Hackathons & Coding Battles', action: 'Host Hackathon' },
      { icon: Users, title: 'Quiz Competitions', action: 'Start Quiz' },
      { icon: Star, title: 'Creative Showcases', action: 'Launch Showcase' },
      { icon: ClipboardList, title: 'Case Study Competitions', action: 'Launch Case Study' },
      { icon: Presentation, title: 'Conferences & Talks', action: 'Create Conference' },
      { icon: BookOpen, title: 'Workshops & Bootcamps', action: 'Schedule Workshop' },
    ],
  },
];

export default function HostOpportunityPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-purple-200 via-purple-100 to-purple-300 flex flex-col items-center justify-center py-12 px-6 overflow-hidden">
      <img
        src="/assets/undraw_online-community_3o0l.svg"
        alt="background"
        className="absolute top-10 right-10 w-40 opacity-10 -z-10 pointer-events-none"
      />
      <div className="max-w-4xl w-full text-center space-y-4 relative z-0">
        <h1 className="text-4xl font-bold text-gray-900">
          Create Opportunities to Lead & Inspire
        </h1>
        <p className="text-gray-600">
          Select the type of initiative you'd like to host. Engage participants through innovation,
          technology, or knowledge-sharing platforms.
        </p>
      </div>

      <div className="mt-12 max-w-7xl w-full space-y-16 relative z-0">
        {opportunitySections.map((section, idx) => (
          <div key={idx} className="space-y-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">{section.title}</h2>
            <p className="text-gray-500">{section.subtitle}</p>

            {/* First Row (4 items) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
              {section.options.slice(0, 4).map((opt, index) => (
                <div
                  key={index}
                  className="group p-8 w-72 rounded-2xl border border-purple-200 bg-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center gap-4 h-52 justify-center"
                >
                  <div className="flex items-center justify-center w-14 h-14 bg-purple-50 rounded-full group-hover:bg-purple-100 transition">
                    <opt.icon
                      size={26}
                      className={
                        opt.title.includes('Hackathon') ? 'text-red-500 group-hover:text-red-600' :
                          opt.title.includes('Quiz') ? 'text-green-500 group-hover:text-green-600' :
                            opt.title.includes('Showcase') ? 'text-yellow-500 group-hover:text-yellow-600' :
                              opt.title.includes('Innovation') ? 'text-blue-500 group-hover:text-blue-600' :
                                'text-purple-600 group-hover:text-purple-700'
                      }
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg group-hover:text-purple-700 transition">
                    {opt.title}
                  </h3>
                  <div className="text-purple-600 font-medium text-sm opacity-90 group-hover:underline">
                    {opt.action} →
                  </div>
                </div>
              ))}
            </div>

            {/* Second Row (3 items, less gap) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center mt-10">
              {section.options.slice(4, 7).map((opt, index) => (
                <div
                  key={index}
                  className="group p-8 w-72 rounded-2xl border border-purple-200 bg-white hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center gap-4 h-52 justify-center"
                >
                  <div className="flex items-center justify-center w-14 h-14 bg-purple-50 rounded-full group-hover:bg-purple-100 transition">
                    <opt.icon
                      size={26}
                      className={
                        opt.title.includes('Workshop') ? 'text-indigo-500 group-hover:text-indigo-600' :
                          opt.title.includes('Conference') ? 'text-teal-500 group-hover:text-teal-600' :
                            opt.title.includes('Case') ? 'text-orange-500 group-hover:text-orange-600' :
                              'text-purple-600 group-hover:text-purple-700'
                      }
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg group-hover:text-purple-700 transition">
                    {opt.title}
                  </h3>
                  <div className="text-purple-600 font-medium text-sm opacity-90 group-hover:underline">
                    {opt.action} →
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
