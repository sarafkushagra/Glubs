import React from 'react';
import img1 from '../images/business-people-standing-together-as-team_3482-8671.jpg';
import img2 from '../images/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.webp';
import { Link } from 'react-router-dom';
export default function LandingPage() {
  return (
    <div>
      {/* Header Section */}
      <section className="min-h-screen bg-gradient-to-b from-indigo-400 to-white ">
        <nav className="flex justify-between items-center px-8 py-4">
  <Link to="/"><img src="/IMAGES/Preview.png" alt="Logo" className="w-16 rounded-full" /></Link>
  <ul className="flex space-x-6 text-black text-xl">
    <li><Link to="/" className="hover:underline">HOME</Link></li>
    <li><Link to="/about" className="hover:underline">ABOUT</Link></li>
    <li><Link to="/event" className="hover:underline">EVENTS</Link></li>
    <li className="border border-black rounded px-2">
      <Link className="hover:text-yellow-600" to="/auth">LOGIN</Link>
    </li>
  </ul>
</nav>
      

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">Gateway to Campus Opportunities</h1>
          <p className="text-lg md:text-xl text-gray-800 mb-6">Discover, register, and attend university events,<br /> hackathons, and workshops.</p>
          <div className="flex gap-4">
            <Link to="/event" className="bg-indigo-500 text-white rounded px-6 py-3 hover:bg-indigo-600 transition">Explore Events</Link>
            <Link to="#" className="border border-white text-black rounded px-6 py-3 hover:bg-white hover:text-indigo-700 transition">For Organisers</Link>
          </div>
        </div>
      </section>

      {/* Working Section */}
      <section className="max-w-6xl mx-auto text-center py-16 px-4">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">How it Works - 4 Simple Steps</h1>
        <p className="text-gray-700 mb-8">Get started in minutes and never miss an opportunity</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: '1. Discover', desc: 'Browse events, hackathons, and workshops from all campus clubs' },
            { title: '2. Register', desc: 'Quick registration with student verification and instant confirmation' },
            { title: '3. Attend', desc: 'Show your QR code for seamless check-in and real-time attendance' },
            { title: '4. Get Recognized', desc: 'Receive automated e-certificates and build your portfolio' }
          ].map((item, idx) => (
            <div key={idx} className="bg-blue-50 rounded-lg p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Event Gallery */}
      <section className="text-center py-16 bg-white">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">Event Gallery Preview</h1>
        <p className="text-gray-700 mb-8">Carousel of Event Images (visible for 10 days)</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto px-4">
          {[1, 2, 3].map((_, idx) => (
            <div key={idx} className="bg-gray-200 aspect-video rounded-lg flex items-center justify-center text-gray-500">
              Event Image
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto text-center py-16 px-4">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">Testimonials</h1>
        <p className="text-gray-700 mb-8">What our community says about GLUBS</p>
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
            <div key={idx} className="bg-blue-50 p-6 rounded-lg flex items-center">
              <img src={item.img} alt={item.name} className="w-16 h-16 rounded-full border border-gray-600 mr-6" />
              <div className="text-left">
                <p className="text-gray-700 mb-2">{item.text}</p>
                <h3 className="font-semibold">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-sky-300 text-center py-16 px-4 rounded-lg max-w-3xl mx-auto mt-16">
        <img src={img1} alt="Call to Action" className="mx-auto rounded-lg mb-6 max-h-64 object-cover" />
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">Enroll For Various Opportunities</h1>
        <a href="#" className="bg-indigo-500 text-white rounded px-6 py-3 hover:bg-indigo-600 transition inline-block">Contact us</a>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-950 text-white text-left py-8 mt-16 px-8">
        <h3 className="text-xl font-semibold mb-4">About Us</h3>
        <p>Glubs helps students discover, register, and attend university events, hackathons, and workshops to boost their campus experience.</p>
      </footer>
    </div>
  );
}
