import React from 'react';
import { Link } from 'react-router-dom'; 
import img1 from '../images/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.webp'; 
import Footer from './Footer';
import Navbar from './Navbar';
const About = () => {
  return (
    <>
    <Navbar/>
      <div className="bg-gradient-to-b pt-30 from-black via-indigo-900 to-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        {/* Hero Section */}
        <section className="py-12">
          <div>
            <h1 className="text-5xl font-bold text-white mb- pb-20">
              Empowering Campus Events with GLUBS
            </h1>
            <p className="text-xl text-white mb-8">
              GLUBS is your ultimate platform for seamless event management, connecting students and organizations with a world of opportunities. From hackathons to workshops, we make event organization and participation effortless.
            </p>
            <div className='flex justify-center gap-6'>
           <Link to="/events">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
             Explore Events
           </button>
           </Link>
           <Link to="/clubs">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
             Explore Clubs
           </button>
           </Link>
           <Link to="/host">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg text-lg">
             Explore Hosting
           </button>
           </Link>
           </div>
          </div>
        </section>


        {/* How It Works Section */}
        <section className="py-12 border-t border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">How Our Website Works</h2>
            <p className="text-white mb-8 max-w-2xl mx-auto">
              Navigating GLUBS is designed to be intuitive and user-friendly. Follow these simple steps to discover, register for, and enjoy your next campus event.
            </p>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { title: 'Browse Events', desc: 'Discover a wide array of upcoming events tailored to your interests.' },
                { title: 'Simple Registration', desc: 'Quickly sign up for events with our streamlined, user-friendly forms.' },
                { title: 'Get Notified', desc: 'Receive timely updates and reminders directly to your inbox.' },
                { title: 'Seamless Check-in', desc: 'Utilize QR codes for fast and efficient entry to all events.' },
              ].map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className="bg-indigo-100 text-indigo-700 w-16 h-16 flex items-center justify-center rounded-full text-2xl font-bold mx-auto mb-4">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-lg text-white  mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="py-12 border-t border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">About GLUBS</h2>
            <div className="space-y-4 text-white max-w-3xl mx-auto">
              <p>
                GLUBS is dedicated to transforming campus event experiences. We provide intuitive tools and resources to help student organizations host impactful events and empower students to discover and engage with opportunities that shape their academic and professional journeys.
              </p>
              <p>
                Our mission is to foster a vibrant campus community by simplifying the complexities of event planning and accessibility. We believe that every student deserves the chance to participate in enriching activities, and every organization deserves the tools to manage them efficiently.
              </p>
              <p>
                Whether you're a student looking for your next challenge, an organizer planning a major seminar, or a club hosting a small workshop, GLUBS is designed to meet your needs. We are constantly evolving our platform to better serve the dynamic landscape of university life.
              </p>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-12 border-t border-gray-200">
  <div>
    <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Features</h2>
    <p className="text-white mb-8 max-w-2xl mx-auto">
      GLUBS is packed with features designed to enhance every aspect of event management and participation, making your experience seamless and effective.
    </p>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        ['QR Registration', 'Fast check-in using unique QR codes.', '/features/qr-registration'],
        ['Secure Payments', 'Pay securely with trusted gateways.', '/features/secure-payments'],
        ['Event Analytics', 'Track event performance & metrics.', '/features/event-analytics'],
        ['Feedback System', 'Share post-event feedback.', '/features/feedback'],
        ['Personalized Dashboards', 'Manage your profile/events easily.', '/features/dashboard'],
        ['Resource Hub', 'Access materials & schedules.', '/features/resource-hub'],
      ].map(([title, desc, link], idx) => (
        <Link to={link} key={idx}>
          <div className="bg-purple-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center hover:cursor-pointer">
            <h3 className="font-bold text-xl mb-3 text-indigo-700">{title}</h3>
            <p className="text-gray-600">{desc}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

        {/* Team Section */}
        <section className="py-12 border-t border-gray-200">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Meet Our Dedicated Team</h2>
            <p className="text-white-600 mb-8 max-w-3xl mx-auto">
              Behind GLUBS is a passionate team committed to delivering the best event management platform. 
              We combine diverse skills and a shared vision to bring you seamless experiences.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Kushagra Saraf",
                  role: "Lead Developer",
                  description: "Leads the backend infrastructure, ensures API reliability, and integrates scalable architecture for future-proof performance.",
                  img: img1,
                },
                {
                  name: "Amit Rana",
                  role: "UI/UX Designer",
                  description: "Designs seamless user experiences with a strong focus on accessibility, responsiveness, and modern visual aesthetics.",
                  img: img1,
                },
                {
                  name: "Piyush Pratap",
                  role: "Frontend Developer",
                  description: "Implements cutting-edge UI features, ensures responsiveness across devices, and connects frontend with backend APIs.",
                  img: img1,
                },
                {
                  name: "Manoj Sharma",
                  role: "Community Manager",
                  description: "Engages with the user community, gathers insights, and ensures continuous improvement through feedback loops.",
                  img: img1,
                },
                {
                  name: "Milan Choudhary",
                  role: "Event Strategist",
                  description: "Designs impactful event campaigns, analyzes trends, and helps clubs optimize for maximum participation and success.",
                  img: img1,
                },
                {
                  name: "Mohan Gupta",
                  role: "Database Manager",
                  description: "Maintains data security, handles large datasets with efficiency, and ensures data integrity across the platform.",
                  img: img1,
                }
              ].map((member, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-24 h-24 object-cover rounded-full mb-4 border-4 border-indigo-100"
                  />
                  <h3 className="font-bold text-xl mb-1 text-indigo-700">{member.name}</h3>
                  <p className="text-gray-500 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      
      </div>
    <Footer />
    </>
  );
};

export default About;
