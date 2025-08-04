import React from 'react';
import { Link } from 'react-router-dom';
import img1 from '../images/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.webp';
import Footer from './Footer';
import Navbar from './Navbar';
import { useTheme } from '../Context/ThemeContext';

const About = () => {
  const { theme } = useTheme();
  const themeStyles = {
    container: {
      background: theme === 'dark'
        ? 'linear-gradient(to bottom, #000000, #312e81, #000000)'
        : 'linear-gradient(to bottom, #dbeafe, #ffffff, #e0e7ff)',
      color: theme === 'dark' ? '#f8fafc' : '#1f2937',
      minHeight: '100vh',
    },
    section: {
      background: theme === 'dark'
        ? 'linear-gradient(to bottom, #312e81, #000000)'
        : 'linear-gradient(to bottom, #f9fafb, #e0e7ff)',
      color: theme === 'dark' ? '#ffffff' : '#111827',
    },
    card: {
      backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.07)' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#1f2937',
      border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
    },
    cardAccent: {
      backgroundColor: theme === 'dark' ? 'rgba(49,46,129,0.5)' : '#e0e7ff',
      color: theme === 'dark' ? '#06b6d4' : '#4f46e5',
    },
    textSecondary: {
      color: theme === 'dark' ? '#d1d5db' : '#6b7280',
    },
  };

  return (
    <div className="flex flex-col min-h-screen font-poppins" style={themeStyles.container}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-12" style={themeStyles.section}>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight text-center" style={{ color: theme === 'dark' ? '#fff' : '#1e293b' }}>
          Revolutionizing Campus Engagement <br />with
          <span className={theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}> GLUBS</span>
        </h1>
        <p className="text-base md:text-lg mb-8 max-w-2xl" style={themeStyles.textSecondary}>
          GLUBS is the premier platform for streamlined event and club management, connecting students with diverse opportunities and empowering organizations.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/events" className={theme === 'dark' ? 'bg-white text-indigo-700 font-semibold rounded-full px-6 py-3 hover:bg-indigo-700 hover:text-white transition-all duration-300 shadow hover:scale-105' : 'bg-indigo-700 text-white font-semibold rounded-full px-6 py-3 hover:bg-white hover:text-indigo-700 transition-all duration-300 shadow hover:scale-105'}>Explore Events</Link>
          <Link to="/clubs" className={theme === 'dark' ? 'border border-white text-white font-semibold rounded-full px-6 py-3 hover:bg-white hover:text-indigo-700 transition-all duration-300 shadow hover:scale-105' : 'border border-indigo-700 text-indigo-700 font-semibold rounded-full px-6 py-3 hover:bg-indigo-700 hover:text-white transition-all duration-300 shadow hover:scale-105'}>Discover Clubs</Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-20 flex flex-col items-center" style={themeStyles.section}>
        <h2 className="text-4xl md:text-6xl font-bold mb-12 text-center" style={{ color: theme === 'dark' ? '#fff' : '#1e293b' }}>Why Join GLUBS?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {[
            { icon: '🤝', title: 'Expanded Network', desc: 'Connect with peers, faculty, and industry professionals.' },
            { icon: '🚀', title: 'Skill Enhancement', desc: 'Develop critical soft and hard skills through experiences.' },
            { icon: '🌟', title: 'Leadership Opportunities', desc: 'Take active roles in events or club leadership.' },
            { icon: '🌱', title: 'Personal Growth', desc: 'Step out of your comfort zone and embrace new challenges.' },
            { icon: '🏘️', title: 'Community Belonging', desc: 'Find your niche and build lasting friendships.' },
            { icon: '🏆', title: 'Showcase Achievements', desc: 'Document your participation and build a robust portfolio.' },
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl p-6 w-56 hover:scale-105 transition" style={themeStyles.card}>
              <div className="flex items-center justify-center w-14 h-14 rounded-full text-3xl mb-4" style={themeStyles.cardAccent}>{item.icon}</div>
              <h3 className="font-bold text-base mb-1 text-center" style={{ color: theme === 'dark' ? '#fff' : '#1e293b' }}>{item.title}</h3>
              <p className="text-xs text-center" style={themeStyles.textSecondary}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-4 flex flex-col items-center" style={themeStyles.section}>
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-12" style={{ color: theme === 'dark' ? '#fff' : '#1e293b' }}>Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          {[
            { title: 'Advanced QR Code Validation', desc: 'Rapid and secure attendee check-ins with dynamic QR codes.' },
            { title: 'Integrated Payments', desc: 'Seamless and secure event registration fee management.' },
            { title: 'Event Analytics', desc: 'In-depth data visualizations and insightful metrics.' },
            { title: 'Feedback System', desc: 'Integrated mechanism for gathering post-event feedback.' },
            { title: 'User Dashboards', desc: 'Intuitive dashboards to manage registrations and profiles.' },
            { title: 'Resource Hub', desc: 'Unified access to event documentation and schedules.' },
          ].map((feature, idx) => (
            <div key={idx} className="p-6 rounded-xl shadow-lg hover:scale-105 transition text-center" style={themeStyles.card}>
              <h3 className={theme === 'dark' ? 'font-bold text-xl mb-3 text-indigo-300' : 'font-bold text-xl mb-3 text-indigo-700'}>{feature.title}</h3>
              <p className="text-base" style={themeStyles.textSecondary}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-20" style={themeStyles.section}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-12" style={{ color: theme === 'dark' ? '#fff' : '#1e293b' }}>Meet the Team</h2>
          <div className="flex gap-6 flex-wrap justify-center">
            {[
              { name: "Mohan Gupta", role: "Lead Backend Architect", description: "Manages stringent data security protocols, optimizes large-scale dataset handling, and ensures data integrity." },
              { name: "Kushagra Saraf", role: "Platform Engineering Lead", description: "Spearheads backend infrastructure, guaranteeing API reliability and scalable solutions." },
              { name: "Amit Rana", role: "Principal UI/UX Strategist", description: "Orchestrates intuitive user experiences with a focus on accessibility and design." },
              { name: "Piyush Pratap", role: "Senior Frontend Engineer", description: "Develops advanced UI functionalities and ensures responsiveness across devices." },
              { name: "Manoj Sharma", role: "Head of Community Engagement", description: "Cultivates user community interaction and ensures continuous platform enhancement." },
              { name: "Milan Choudhary", role: "Event & Growth Strategist", description: "Designs event campaigns and provides strategic guidance for optimizing participation." },
            ].map((member, idx) => (
              <div key={idx} className="rounded-2xl p-8 flex flex-col items-center w-64 shadow-lg hover:scale-105 transition" style={themeStyles.card}>
                <img src={img1} alt={member.name} className="w-20 h-20 rounded-full border-2 mb-4" style={{ borderColor: theme === 'dark' ? '#6366f1' : '#4f46e5' }} />
                <h3 className="font-semibold text-lg mb-1" style={{ color: theme === 'dark' ? '#fff' : '#1e293b' }}>{member.name}</h3>
                <p className={theme === 'dark' ? 'font-medium mb-2 text-sm text-indigo-300' : 'font-medium mb-2 text-sm text-indigo-700'}>{member.role}</p>
                <p className="text-xs text-center" style={themeStyles.textSecondary}>{member.description}</p>
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
