import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Users, Lightbulb, Star, BookOpen, ClipboardList, Presentation } from 'lucide-react';
import Footer from '../Pages/Footer';
import Navbar from '../Pages/Navbar';

export default function HostOpportunityPage() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-50 flex flex-col items-center px-4 pb-16">
        <div className="max-w-2xl text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Host Opportunities
          </h1>
          <p className="text-gray-600">
            Choose what you want to host and engage your community effectively.
          </p>
        </div>


<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 max-w-6xl w-full justify-items-center">

  {/* Innovation Challenges */}
  <Link to={'/events/add'} state={{ category: 'innovation_challenge' }}
    className="group w-full max-w-xs p-6 bg-white rounded-xl border border-purple-200 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer flex flex-col items-center text-center">
    <div className="bg-purple-100 p-3 rounded-full mb-4">
      <Lightbulb className="text-blue-500" size={30} />
    </div>
    <h3 className="font-semibold text-lg text-gray-800">Innovation Challenges</h3>
    <p className="text-purple-600 mt-1 text-sm">Create Challenge →</p>
  </Link>

  {/* Hackathons */}
  <Link to={'/events/add'} state={{ category: 'hackathon' }}
    className="group w-full max-w-xs p-6 bg-white rounded-xl border border-purple-200 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer flex flex-col items-center text-center">
    <div className="bg-purple-100 p-3 rounded-full mb-4">
      <Rocket className="text-red-500" size={30} />
    </div>
    <h3 className="font-semibold text-lg text-gray-800">Hackathons & Coding Battles</h3>
    <p className="text-purple-600 mt-1 text-sm">Host Hackathon →</p>
  </Link>

  {/* Quiz Competitions */}
  <Link to={'/events/add'} state={{ category: 'quiz' }}
    className="group w-full max-w-xs p-6 bg-white rounded-xl border border-purple-200 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer flex flex-col items-center text-center">
    <div className="bg-purple-100 p-3 rounded-full mb-4">
      <Users className="text-green-500" size={30} />
    </div>
    <h3 className="font-semibold text-lg text-gray-800">Quiz Competitions</h3>
    <p className="text-purple-600 mt-1 text-sm">Start Quiz →</p>
  </Link>

  {/* Creative Showcases */}
  <Link to={'/events/add'} state={{ category: 'creative_showcase' }}
    className="group w-full max-w-xs p-6 bg-white rounded-xl border border-purple-200 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer flex flex-col items-center text-center">
    <div className="bg-purple-100 p-3 rounded-full mb-4">
      <Star className="text-yellow-500" size={30} />
    </div>
    <h3 className="font-semibold text-lg text-gray-800">Creative Showcases</h3>
    <p className="text-purple-600 mt-1 text-sm">Launch Showcase →</p>
  </Link>

  {/* Case Study Competitions */}
  <Link to={'/events/add'} state={{ category: 'case_study' }}
    className="group w-full max-w-xs p-6 bg-white rounded-xl border border-purple-200 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer flex flex-col items-center text-center">
    <div className="bg-purple-100 p-3 rounded-full mb-4">
      <ClipboardList className="text-orange-500" size={30} />
    </div>
    <h3 className="font-semibold text-lg text-gray-800">Case Study Competitions</h3>
    <p className="text-purple-600 mt-1 text-sm">Launch Case Study →</p>
  </Link>

  {/* Conferences & Talks */}
  <Link to={'/events/add'} state={{ category: 'conference' }}
    className="group w-full max-w-xs p-6 bg-white rounded-xl border border-purple-200 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer flex flex-col items-center text-center">
    <div className="bg-purple-100 p-3 rounded-full mb-4">
      <Presentation className="text-teal-500" size={30} />
    </div>
    <h3 className="font-semibold text-lg text-gray-800">Conferences & Talks</h3>
    <p className="text-purple-600 mt-1 text-sm">Create Conference →</p>
  </Link>

  {/* Workshops & Bootcamps */}
  <Link to={'/events/add'} state={{ category: 'workshop' }}
    className="group w-full max-w-xs p-6 bg-white rounded-xl border border-purple-200 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer flex flex-col items-center text-center">
    <div className="bg-purple-100 p-3 rounded-full mb-4">
      <BookOpen className="text-indigo-500" size={30} />
    </div>
    <h3 className="font-semibold text-lg text-gray-800">Workshops & Bootcamps</h3>
    <p className="text-purple-600 mt-1 text-sm">Schedule Workshop →</p>
  </Link>

</div>

      </div>
      <Footer />
    </>
  );
}
