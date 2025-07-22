import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  QrCode,
  BarChart4,
  PencilRuler,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  Users,
  Settings2,
  CheckCircle2,
} from 'lucide-react';

const features = [
  {
    icon: <CalendarDays size={28} className="text-indigo-400 mb-3" />,
    title: 'Event Scheduling',
    points: [
      'Set session-wise breakdowns with reminders.',
      'Never miss a slot with real-time alerts.',
    ],
  },
  {
    icon: <QrCode size={28} className="text-indigo-400 mb-3" />,
    title: 'QR Attendance',
    points: [
      'Auto-generated QR codes for every event.',
      'Fast, secure check-ins via student ID.',
    ],
  },
  {
    icon: <BarChart4 size={28} className="text-indigo-400 mb-3" />,
    title: 'Live Analytics',
    points: [
      'Real-time dashboard for attendance & feedback.',
      'Make better decisions with instant data.',
    ],
  },
  {
    icon: <PencilRuler size={28} className="text-indigo-400 mb-3" />,
    title: 'Simple Event Creation',
    points: [
      'Create and customize events in minutes.',
      'Add banners, details & registration limits easily.',
    ],
  },
  {
    icon: <MessageSquareQuote size={28} className="text-indigo-400 mb-3" />,
    title: 'Intelligent Feedback',
    points: [
      'Collect feedback with smart forms.',
      'Analyze participant experience instantly.',
    ],
  },
  {
    icon: <ShieldCheck size={28} className="text-indigo-400 mb-3" />,
    title: 'Secure Management',
    points: [
      'Only verified organizers can manage data.',
      'Keep student and event info safe.',
    ],
  },
  {
    icon: <Sparkles size={28} className="text-indigo-400 mb-3" />,
    title: 'Custom Branding',
    points: [
      'Add your college or fest branding easily.',
      'Make your event stand out beautifully.',
    ],
  },
  {
    icon: <Users size={28} className="text-indigo-400 mb-3" />,
    title: 'Team Collaboration',
    points: [
      'Add co-hosts and team members securely.',
      'Assign specific roles to each member.',
    ],
  },
  {
    icon: <Settings2 size={28} className="text-indigo-400 mb-3" />,
    title: 'Automation Tools',
    points: [
      'Auto-send reminders, track signups, and follow-ups.',
      'Focus on hosting, let us handle the rest.',
    ],
  },
];

const Organizers = () => {
  return (
    <div className="pt-30 w-screen min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto  px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 text-transparent bg-clip-text drop-shadow-2xl">
            Launch Bold Campus Experiences
          </h1>
          <p className="mt-5 text-xl text-gray-300 max-w-3xl mx-auto">
            Plan, manage and supercharge your campus events with GLUBS — the ultimate platform for organizers.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {features.map(({ icon, title, points }, idx) => (
            <div key={idx} className="bg-[#1e1b3a] hover:bg-[#2d295c] transition duration-300 shadow-2xl p-6 rounded-2xl text-left">
              {icon}
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-300">
                {points.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="bg-[#1e1b3a] rounded-2xl shadow-inner p-10 mb-20">
          <h2 className="text-3xl font-bold text-center text-indigo-300 mb-6">Organize in 5 Easy Steps</h2>
          <ol className="list-decimal text-gray-300 pl-6 space-y-3 max-w-3xl mx-auto text-lg">
            <li>Sign up as a verified organizer on GLUBS.</li>
            <li>Create events with schedules, banners, and limits.</li>
            <li>Launch & promote using QR and shareable links.</li>
            <li>Track participants, attendance, and feedback live.</li>
            <li>Download analytics and improve your next event!</li>
          </ol>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link
            to="/auth"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white px-10 py-4 rounded-full text-xl font-bold shadow-lg transition duration-300"
          >
            Get Started as Organizer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Organizers;