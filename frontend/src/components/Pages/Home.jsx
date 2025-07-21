import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import img1 from '../images/business-people-standing-together-as-team_3482-8671.jpg';
import img2 from '../images/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.webp';
import event1 from '../images/EventA.jpg';
import event2 from '../images/EventB.jpg';
import event3 from '../images/EventC.jpg';
import backgroundhero from '../images/backgroundhero.avif'; // Add your .avif image here


import Footer from './Footer';

export default function LandingPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-white text-gray-800">
      <Navbar />
      

      {/* Sidebar and Toggle Button
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <button
        onClick={toggleSidebar}
        className="fixed top-24 left-4 z-50 bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700"
      >
        ☰ Menu
      </button>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> */}

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center md:items-center justify-start text-left px-4 md:pl-20 pl-4 bg-gradient-to-b from-black via-indigo-900 to-black text-white transition-all duration-700 ease-in-out">
        <div className="flex-1 flex flex-col justify-center items-start h-full md:min-h-screen md:py-0 py-12">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in-down pl-2 md:pl-4">
            Gateway to Campus Opportunities
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 mb-8 max-w-xl animate-fade-in-up pl-2 md:pl-4">
            Discover, register, and attend university events, hackathons, and workshops to level up your campus journey.
          </p>
          <div className="flex gap-4 flex-wrap justify-start animate-fade-in-up pl-2 md:pl-4">
            <Link
              to="/events"
              className="bg-white text-indigo-700 font-semibold rounded-full px-6 py-3 hover:bg-indigo-700 hover:text-white transition-all duration-300 shadow hover:scale-105"
            >
              Explore Events
            </Link>
            <Link
              to="/features/Organizers"
              className="border border-white text-white font-semibold rounded-full px-6 py-3 hover:bg-white hover:text-indigo-700 transition-all duration-300 shadow hover:scale-105"
            >
              For Organizers
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center mt-8 md:mt-0">
          <img src={backgroundhero} alt="Hero" className="w-full max-w-xl rounded-xl object-cover" />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-black text-white py-20 px-4 flex flex-col md:flex-row items-center md:items-stretch">
        {/* Left: Steps List */}
        <div className="flex-1 flex flex-col gap-10 pl-10 md:pl-32">
          {[
            {
              icon: (
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-900 text-cyan-300 text-3xl mr-6">
                  ★
                </span>
              ),
              title: 'Discover',
              desc: 'Browse campus events, hackathons, and workshops'
            },
            {
              icon: (
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-900 text-cyan-300 text-3xl mr-6">
                  ✔
                </span>
              ),
              title: 'Register',
              desc: 'Quick registration and instant confirmation'
            },
            {
              icon: (
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-900 text-cyan-300 text-3xl mr-6">
                  🕒
                </span>
              ),
              title: 'Attend',
              desc: 'QR check-in for seamless attendance'
            },
            {
              icon: (
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-900 text-cyan-300 text-3xl mr-6">
                  🏆
                </span>
              ),
              title: 'Get Recognized',
              desc: 'Receive certificates and build your profile'
            }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start">
              {item.icon}
              <div>
                <h3 className="text-2xl font-semibold mb-1 text-white">{item.title}</h3>
                <p className="text-gray-300 text-lg">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Right: Heading */}
        <div className="flex-1 flex items-center justify-center mb-10 md:mb-0">
          <h2 className="text-4xl md:text-6xl font-bold text-left md:text-center w-full">How it Works</h2>
        </div>
      </section>

      {/* Event Gallery */}
      <section className="w-full bg-gradient-to-b from-black via-indigo-900 to-black py-20 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-6xl font-bold mb-8 text-white text-left">Event Gallery</h2>
          <div className="flex gap-6 flex-wrap justify-start">
            {[event1, event2, event3, event1].map((img, idx) => (
              <div key={idx} className="bg-[#181c23] rounded-xl p-4 w-56">
                <img src={img} alt={`Event ${idx + 1}`} className="rounded-lg w-full h-56 object-cover mb-2" />
                <div>
                  <h3 className="font-bold text-white text-base mb-1">Event Title</h3>
                  <p className="text-gray-400 text-xs">Subtitle or attendees</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-20 px-4 bg-black text-white">
        {/* Heading Row */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-left mb-6 md:mb-0 whitespace-pre-line">What people are saying about us.</h2>
          
        </div>
        {/* Testimonials Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
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
            },
            {
              img: img2,
              text: '"This platform made it so easy to find and join events. Highly recommended!"',
              name: 'Johny Bhai'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#111827] rounded-2xl p-8 flex flex-col h-full shadow-lg">
              <span className="text-cyan-400 text-5xl mb-4">&ldquo;</span>
              <p className="text-white text-lg mb-8">{item.text}</p>
              <div className="flex items-center mt-auto">
                <img src={item.img} alt={item.name} className="w-12 h-12 rounded-full border-2 border-cyan-400 mr-4" />
                <div>
                  <h3 className="font-semibold text-white">{item.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
<section className="w-full bg-gradient-to-b from-black via-indigo-900 to-indigo-900 text-white text-center py-16 px-6">
  <div className="w-4/5 mx-auto">
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-10 shadow-lg flex flex-col items-center space-y-6">
      <h2 className="text-3xl sm:text-4xl font-bold">Enroll in Opportunities Today</h2>
      <p className="text-purple-100 max-w-xl mx-auto">
        Start your journey by participating in campus events, workshops, and hackathons to enhance your skills and network with like-minded peers.
      </p>
      <Link
        to="/contact"
        className="inline-block bg-white text-indigo-700 font-semibold rounded-full px-6 py-3 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow hover:scale-105"
      >
        Contact Us
      </Link>
    </div>
  </div>
</section>


      {/* Footer */}
      
      <Footer />
    </div>
  );
}