import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import img1 from '../images/business-people-standing-together-as-team_3482-8671.jpg';
import img2 from '../images/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.webp';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-poppins">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-b from-indigo-600  to-white flex flex-col justify-center items-center text-center px-4">
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black drop-shadow-lg">
          Gateway to Campus Opportunities
        </h1>
        <p className="text-lg md:text-xl text-gray-500 mb-6 max-w-lg">
          Discover, register, and attend university events, hackathons, and workshops to level up your campus journey.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            to="/events"
            className="bg-white text-indigo-600 rounded px-6 py-3 hover:bg-indigo-600 hover:text-white transition shadow-md"
          >
            Explore Events
          </Link>
          <Link
            to="/auth"
            className="border border-white text-black rounded px-6 py-3 hover:bg-white hover:text-indigo-600 transition shadow-md"
          >
            For Organizers
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto text-center py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-indigo-700">How it Works - 4 Simple Steps</h2>
        <p className="text-gray-600 mb-8">Get started in minutes and never miss an opportunity</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: '1. Discover', desc: 'Browse campus events, hackathons, and workshops' },
            { title: '2. Register', desc: 'Quick registration and instant confirmation' },
            { title: '3. Attend', desc: 'QR check-in for seamless attendance' },
            { title: '4. Get Recognized', desc: 'Receive certificates and build your profile' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2 text-indigo-700">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Event Gallery */}
      <section className="bg-gradient-to-r from-purple-100 via-indigo-100 to-white py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-indigo-700">Event Gallery Preview</h2>
        <p className="text-gray-600 mb-8">Carousel of Event Images (visible for 10 days)</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto px-4">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="bg-gray-200 aspect-video rounded-lg flex items-center justify-center text-gray-500">
              Event Image
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto py-16 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-indigo-700">Testimonials</h2>
        <p className="text-gray-600 mb-8">What our community says about GLUBS</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              img: img2,
              text: '"GLUBS increased our event turnout by 300%! The QR system made attendance tracking so easy."',
              name: 'Mark Zuckerberg'
            },
            {
              img: img2,
              text: '"Finally, I never miss events. The dashboard keeps me updated on everything happening on campus."',
              name: 'Katrina Kaif'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg flex items-center shadow hover:shadow-lg transition">
              <img src={item.img} alt={item.name} className="w-16 h-16 rounded-full border border-gray-300 mr-6" />
              <div className="text-left">
                <p className="text-gray-700 mb-2 italic">{item.text}</p>
                <h3 className="font-semibold text-indigo-700">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-indigo-600 text-white text-center py-16 px-4 rounded-lg max-w-3xl mx-auto mt-16 shadow-lg">
        <img
          src={img1}
          alt="Call to Action"
          className="mx-auto rounded-lg mb-6 max-h-64 object-cover shadow-md"
        />
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">Enroll For Various Opportunities</h2>
        <Link
          to="/contact"
          className="bg-white text-indigo-600 rounded px-6 py-3 hover:bg-indigo-700 hover:text-white transition inline-block shadow"
        >
          Contact us
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white text-left py-8 mt-16 px-8">
        <h3 className="text-xl font-semibold mb-4">About Us</h3>
        <p>
          Glubs helps students discover, register, and attend university events, hackathons, and workshops,
          building connections and skills for their future.
        </p>
        <p className="text-gray-400 text-sm mt-2">&copy; 2025 Glubs. All rights reserved.</p>
      </footer>
    </div>
  );
}
