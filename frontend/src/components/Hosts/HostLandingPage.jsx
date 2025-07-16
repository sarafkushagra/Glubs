import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Users, Lightbulb, Star, BookOpen, ClipboardList, Presentation } from 'lucide-react';
import Footer from '../Pages/Footer';
import ClubNavbar from '../Clubs/ClubNavbar';

export default function HostOpportunityPage() {
  const navigate = useNavigate();

  return (
    <>
      <ClubNavbar />
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
          <div className="group w-full max-w-xs p-6 bg-white rounded-xl border border-purple-200 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer flex flex-col items-center text-center">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <Lightbulb className="text-blue-500" size={30} />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">Innovation Challenges</h3>
            <Link to={'/host/hostform'} state={{ category: 'innovation_challenge' }}><p className="text-purple-600 mt-1 text-sm">Create Challenge →</p></Link>
          </div>

          {/* Hackathons */}
          <div className="group w-full max-w-xs p-6 bg-white rounded-xl border border-purple-200 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer flex flex-col items-center text-center">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <Rocket className="text-red-500" size={30} />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">Hackathons & Coding Battles</h3>
            <Link to={'/host/hostform'} state={{ category: 'hackathon' }}><p className="text-purple-600 mt-1 text-sm">Host Hackathon →</p></Link>
          </div>

          {/* Quiz Competitions (Redirects on click) */}
          <div
            onClick={() => navigate('/host/hostform', { state: { category: 'quiz' } })}
            className="group w-full max-w-xs p-6 bg-white rounded-xl border border-purple-200 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer flex flex-col items-center text-center"
          >
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <Users className="text-green-500" size={30} />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">Quiz Competitions</h3>
            <Link to={'/host/hostform'}><p className="text-purple-600 mt-1 text-sm">Start Quiz →</p></Link>
          </div>

          {/* Creative Showcases */}
          <div className="group w-full max-w-xs p-6 bg-white rounded-xl border border-purple-200 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer flex flex-col items-center text-center">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <Star className="text-yellow-500" size={30} />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">Creative Showcases</h3>
            <Link to={'/host/hostform'} state={{ category: 'creative_showcase' }}><p className="text-purple-600 mt-1 text-sm">Launch Showcase →</p></Link>
          </div>

          {/* Case Study Competitions */}
          <div className="group w-full max-w-xs p-6 bg-white rounded-xl border border-purple-200 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer flex flex-col items-center text-center">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <ClipboardList className="text-orange-500" size={30} />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">Case Study Competitions</h3>
            <Link to={'/host/hostform'} state={{ category: 'case_study' }}><p className="text-purple-600 mt-1 text-sm">Launch Case Study →</p></Link>
          </div>

          {/* Conferences & Talks */}
          <div className="group w-full max-w-xs p-6 bg-white rounded-xl border border-purple-200 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer flex flex-col items-center text-center">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <Presentation className="text-teal-500" size={30} />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">Conferences & Talks</h3>
            <Link to={'/host/hostform'} state={{ category: 'conference' }}><p className="text-purple-600 mt-1 text-sm">Create Conference →</p></Link>
          </div>

          {/* Workshops & Bootcamps */}
          <div className="group w-full max-w-xs p-6 bg-white rounded-xl border border-purple-200 hover:shadow-lg hover:-translate-y-1 transition cursor-pointer flex flex-col items-center text-center">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <BookOpen className="text-indigo-500" size={30} />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">Workshops & Bootcamps</h3>
            <Link to={'/host/hostform'} state={{ category: 'workshop' }}><p className="text-purple-600 mt-1 text-sm">Schedule Workshop →</p></Link>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}
