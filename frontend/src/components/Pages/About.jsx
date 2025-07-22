import React from 'react';
import { Link } from 'react-router-dom';
import img1 from '../images/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.webp';
import Footer from './Footer';
import Navbar from './Navbar';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen font-poppins bg-gradient-to-b from-black via-indigo-900 to-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-12 bg-gradient-to-b from-indigo-900 to-black text-white">

        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-center">
          Revolutionizing Campus Engagement <br />with
          <span className="text-indigo-300"> GLUBS</span>
        </h1>

        <p className="text-base md:text-lg text-gray-300 mb-8 max-w-2xl">
          GLUBS is the premier platform for streamlined event and club management, connecting students with diverse opportunities and empowering organizations.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/events" className="bg-white text-indigo-700 font-semibold rounded-full px-6 py-3 hover:bg-indigo-700 hover:text-white transition-all duration-300 shadow hover:scale-105">Explore Events</Link>
          <Link to="/clubs" className="border border-white text-white font-semibold rounded-full px-6 py-3 hover:bg-white hover:text-indigo-700 transition-all duration-300 shadow hover:scale-105">Discover Clubs</Link>
          <Link to="/host" className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full px-6 py-3 transition-all duration-300 shadow hover:scale-105">Host an Event</Link>
        </div>
      </section>

      
            {/* Benefits Section */}
      <section className="w-full  py-20 text-white flex flex-col items-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-12 text-center">Why Join GLUBS?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {[
            { icon: '🤝', title: 'Expanded Network', desc: 'Connect with peers, faculty, and industry professionals.' },
            { icon: '🚀', title: 'Skill Enhancement', desc: 'Develop critical soft and hard skills through experiences.' },
            { icon: '🌟', title: 'Leadership Opportunities', desc: 'Take active roles in events or club leadership.' },
            { icon: '🌱', title: 'Personal Growth', desc: 'Step out of your comfort zone and embrace new challenges.' },
            { icon: '🏘️', title: 'Community Belonging', desc: 'Find your niche and build lasting friendships.' },
            { icon: '🏆', title: 'Showcase Achievements', desc: 'Document your participation and build a robust portfolio.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-6 w-56 hover:scale-105 transition hover:bg-white/20">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-800/50 text-indigo-300 text-3xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-white text-base mb-1 text-center">{item.title}</h3>
              <p className="text-gray-300 text-xs text-center">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-4 text-white flex flex-col items-center">
  <h2 className="text-4xl md:text-6xl font-bold text-center mb-12">Core Features</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
    {[
      { title: 'Advanced QR Code Validation', desc: 'Rapid and secure attendee check-ins with dynamic QR codes.' },
      { title: 'Integrated Payments', desc: 'Seamless and secure event registration fee management.' },
      { title: 'Event Analytics', desc: 'In-depth data visualizations and insightful metrics.' },
      { title: 'Feedback System', desc: 'Integrated mechanism for gathering post-event feedback.' },
      { title: 'User Dashboards', desc: 'Intuitive dashboards to manage registrations and profiles.' },
      { title: 'Resource Hub', desc: 'Unified access to event documentation and schedules.' },
    ].map((feature, idx) => (
      <div key={idx} className="bg-white/10 p-6 rounded-xl shadow-lg hover:scale-105 transition backdrop-blur-md text-center hover:bg-white/20">
        <h3 className="font-bold text-xl mb-3 text-indigo-300">{feature.title}</h3>
        <p className="text-gray-300 text-base">{feature.desc}</p>
      </div>
    ))}
  </div>
</section>



      {/* Team Section */}
      <section className="w-full  py-20 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-12">Meet the Team</h2>
          <div className="flex gap-6 flex-wrap justify-center">
            {[
              { name: "Mohan Gupta", role: "Lead Backend Architect", description: "Manages stringent data security protocols, optimizes large-scale dataset handling, and ensures data integrity." },
              { name: "Kushagra Saraf", role: "Platform Engineering Lead", description: "Spearheads backend infrastructure, guaranteeing API reliability and scalable solutions." },
              { name: "Amit Rana", role: "Principal UI/UX Strategist", description: "Orchestrates intuitive user experiences with a focus on accessibility and design." },
              { name: "Piyush Pratap", role: "Senior Frontend Engineer", description: "Develops advanced UI functionalities and ensures responsiveness across devices." },
              { name: "Manoj Sharma", role: "Head of Community Engagement", description: "Cultivates user community interaction and ensures continuous platform enhancement." },
              { name: "Milan Choudhary", role: "Event & Growth Strategist", description: "Designs event campaigns and provides strategic guidance for optimizing participation." },
            ].map((member, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 flex flex-col items-center w-64 shadow-lg hover:scale-105 transition hover:bg-white/20">
                <img src={img1} alt={member.name} className="w-20 h-20 rounded-full border-2 border-indigo-400 mb-4" />
                <h3 className="font-semibold text-white text-lg mb-1">{member.name}</h3>
                <p className="text-indigo-300 font-medium mb-2 text-sm">{member.role}</p>
                <p className="text-gray-300 text-xs text-center">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
