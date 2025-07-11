import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import img1 from '../images/business-people-standing-together-as-team_3482-8671.jpg';
import img2 from '../images/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.webp';
import event1 from '../images/EventA.jpg';
import event2 from '../images/EventB.jpg';
import event3 from '../images/EventC.jpg';



import Footer from './Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-poppins bg-white text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-b from-black via-indigo-900 to-white text-white transition-all duration-700 ease-in-out">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in-down">
          Gateway to Campus Opportunities
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl animate-fade-in-up">
          Discover, register, and attend university events, hackathons, and workshops to level up your campus journey.
        </p>
        <div className="flex gap-4 flex-wrap justify-center animate-fade-in-up">
          <Link
            to="/events"
            className="bg-white text-indigo-700 font-semibold rounded-full px-6 py-3 hover:bg-indigo-700 hover:text-white transition-all duration-300 shadow hover:scale-105"
          >
            Explore Events
          </Link>
          <Link
            to="/Organizers"
            className="border border-white text-white font-semibold rounded-full px-6 py-3 hover:bg-white hover:text-indigo-700 transition-all duration-300 shadow hover:scale-105"
          >
            For Organizers
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto text-center py-20 px-4">
        <h2 className="text-4xl font-bold mb-4 text-indigo-700">How it Works</h2>
        <p className="text-gray-500 mb-12">Get started in 4 simple steps</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Discover', desc: 'Browse campus events, hackathons, and workshops' },
            { title: 'Register', desc: 'Quick registration and instant confirmation' },
            { title: 'Attend', desc: 'QR check-in for seamless attendance' },
            { title: 'Get Recognized', desc: 'Receive certificates and build your profile' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 duration-300"
            >
              <h3 className="text-2xl font-semibold mb-2 text-indigo-700">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Event Gallery */}
      <section className="bg-gradient-to-r from-purple-50 via-indigo-100 to-white py-20 text-center">
        <h2 className="text-4xl font-bold mb-4 text-indigo-700">Event Gallery</h2>
        <p className="text-gray-600 mb-8">A sneak peek into our vibrant campus events</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto px-4">
    {[event1, event2, event3].map((image, idx) => (
    <img
      key={idx}
      src={image}
      alt={`Event Preview ${idx + 1}`}
      className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300 object-cover w-full h-64"
    />
    ))}
    </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto py-20 px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 text-indigo-700">What Students Say</h2>
        <p className="text-gray-500 mb-12">Voices from our happy users</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <div
              key={idx}
              className="bg-white p-6 rounded-xl flex items-center shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 duration-300"
            >
              <img src={item.img} alt={item.name} className="w-16 h-16 rounded-full border mr-6" />
              <div className="text-left">
                <p className="text-gray-700 mb-2 italic">{item.text}</p>
                <h3 className="font-semibold text-indigo-700">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-indigo-700 text-white text-center py-20 px-4 rounded-2xl max-w-3xl mx-auto mt-16 shadow-xl">
        <img
          src={img1}
          alt="Call to Action"
          className="mx-auto rounded-xl mb-6 max-h-64 object-cover shadow-lg"
        />
        <h2 className="text-4xl font-bold mb-4">Enroll in Opportunities</h2>
        <Link
          to="/contact"
          className="bg-white text-indigo-700 font-semibold rounded-full px-6 py-3 hover:bg-indigo-800 hover:text-white transition-all duration-300 inline-block shadow hover:scale-105"
        >
          Contact us
        </Link>
      </section>

      {/* Footer */}
      
      <Footer />
    </div>
  );
}