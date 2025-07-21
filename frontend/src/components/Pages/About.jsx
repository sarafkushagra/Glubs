import React from 'react';
import { Link } from 'react-router-dom';
import img1 from '../images/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.webp';
import Footer from './Footer';
import Navbar from './Navbar';

const About = () => {
  return (
    <>
      <Navbar />
      {/* Main Container with Gradient Background */}
      <div className="bg-gradient-to-b from-black via-indigo-900 to-indigo-700 min-h-screen text-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> {/* Removed text-center from here, will apply per section */}

          {/* Hero Section - Centered */}
          <section className="py-12 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Revolutionizing Campus Engagement with <span className="text-indigo-300">GLUBS</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
              GLUBS stands as the premier platform for streamlined event and club management, seamlessly connecting students with diverse opportunities and empowering organizations to maximize their outreach and impact. From academic conferences to vibrant cultural festivals, we transform campus event dynamics.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/events">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300">
                  Explore Events
                </button>
              </Link>
              <Link to="/clubs">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300">
                  Discover Clubs
                </button>
              </Link>
              <Link to="/host">
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300">
                  Host an Event
                </button>
              </Link>
            </div>
          </section>

          <hr className="my-12 border-indigo-500 opacity-50" />

          {/* About Section - Now positioned prominently, potentially with a two-column layout on larger screens */}
          <section className="py-12">
            <h2 className="text-4xl font-bold mb-6 text-center">Our Vision for <span className="text-indigo-300">GLUBS</span></h2>
            <div className="md:grid md:grid-cols-2 md:gap-12 items-center"> {/* Two-column layout on medium screens and up */}
              <div className="mb-8 md:mb-0">
                <img
                  src="https://www.fujitsu.com/global/imagesgig5/201705event_600x360_tcm100-4318548_tcm100-2750236-32.jpg" // Placeholder image, replace with a relevant image
                  alt="Campus Engagement"
                  className="rounded-lg shadow-xl border border-indigo-500 transform transition-all duration-300 hover:scale-102"
                />
              </div>
              <div className="space-y-6 text-lg opacity-90 text-left"> {/* Aligned text to left for better readability in multi-column */}
                <p>
                  GLUBS is committed to fundamentally transforming the landscape of campus event experiences. We deliver sophisticated tools and comprehensive resources, enabling student organizations to conceptualize, organize, and execute highly impactful events, while simultaneously empowering students to readily discover and actively engage with opportunities that are pivotal to their holistic academic and professional development.
                </p>
                <p>
                  Our core mission is to cultivate a vibrant, interconnected campus community by meticulously simplifying the inherent complexities of event orchestration and accessibility. We firmly believe in equitable access to enriching activities for every student and providing every organization with the robust capabilities required for efficient and successful event management.
                </p>
                <p>
                  Whether you are a student aspiring to broaden your horizons, an organizational leader meticulously planning a flagship seminar, or a club coordinator arranging an intimate workshop, GLUBS is meticulously engineered to comprehensively address your specific requirements. We continuously iterate and enhance our platform to proactively adapt to the dynamic and evolving demands of contemporary university life.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-12 border-indigo-500 opacity-50" />

          {/* How It Works Section - Grid remains the same, but section header is centered */}
          <section className="py-12 text-center">
            <h2 className="text-4xl font-bold mb-8">The GLUBS Operational Framework</h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto opacity-80">
              GLUBS is engineered for intuitive and efficient user interaction. Our streamlined process ensures seamless discovery, registration, and participation in all campus events.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Curated Event Discovery', desc: 'Effortlessly explore a comprehensive array of upcoming events and affiliated organizations, meticulously categorized to align with your academic and personal interests.', icon: '🔍' },
                { title: 'Expedited Registration Process', desc: 'Secure your participation swiftly through our optimized, user-centric registration workflows, minimizing friction and maximizing convenience.', icon: '📝' },
                { title: 'Proactive Engagement & Alerts', desc: 'Receive critical updates and timely reminders directly to your preferred communication channels, ensuring you remain informed and never miss a vital opportunity.', icon: '🔔' },
                { title: 'Effortless Access & Validation', desc: 'Leverage advanced QR code technology for rapid and secure event entry, providing a seamless and professional check-in experience.', icon: '🎟️' },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="bg-white bg-opacity-10 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out hover:-translate-y-2 backdrop-blur-sm"
                >
                  <div className="bg-indigo-400 text-indigo-900 w-16 h-16 flex items-center justify-center rounded-full text-3xl font-bold mx-auto mb-4 shadow-md">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-2xl mb-2 text-gray-800">{step.title}</h3>
                  <p className="text-gray-700 text-base">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="my-12 border-indigo-500 opacity-50" />

          {/* New Section: Benefits of Engaging with GLUBS */}
          <section className="py-12 text-center">
            <h2 className="text-4xl font-bold mb-8">Benefits of Engaging with <span className="text-indigo-300">GLUBS</span></h2>
            <p className="text-lg mb-10 max-w-3xl mx-auto opacity-90">
              Participating in GLUBS events and connecting with organizations offers a multitude of advantages designed to enrich your university experience and beyond.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Expanded Network', desc: 'Connect with peers, faculty, and industry professionals, significantly broadening your academic and career network.', icon: '🤝' },
                { title: 'Skill Enhancement', desc: 'Develop critical soft and hard skills through hands-on experiences, workshops, and collaborative projects.', icon: '🚀' },
                { title: 'Leadership Opportunities', desc: 'Take on active roles in event organization or club leadership, cultivating invaluable leadership qualities.', icon: '🌟' },
                { title: 'Personal Growth', desc: 'Step out of your comfort zone, embrace new challenges, and discover hidden talents within a supportive community.', icon: '🌱' },
                { title: 'Community Belonging', desc: 'Find your niche and build lasting friendships within diverse clubs and shared interest groups.', icon: '🏘️' },
                { title: 'Showcase Achievements', desc: 'Document your participation and contributions, building a robust portfolio for future academic and professional endeavors.', icon: '🏆' },
              ].map((benefit, idx) => (
                <div
                  key={idx}
                  className="bg-white bg-opacity-10 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out hover:-translate-y-2 backdrop-blur-sm"
                >
                  <div className="bg-purple-400 text-purple-900 w-16 h-16 flex items-center justify-center rounded-full text-3xl font-bold mx-auto mb-4 shadow-md">
                    {benefit.icon}
                  </div>
                  <h3 className="font-bold text-2xl mb-2 text-gray-800">{benefit.title}</h3>
                  <p className="text-gray-700 text-base">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="my-12 border-indigo-500 opacity-50" />

          {/* New Section: Learning Opportunities */}
          <section className="py-12 text-center">
            <h2 className="text-4xl font-bold mb-8">Unlock Your Potential: Learning through <span className="text-indigo-300">GLUBS</span></h2>
            <p className="text-lg mb-10 max-w-3xl mx-auto opacity-90">
              GLUBS is more than just events; it's a dynamic ecosystem for continuous learning, fostering intellectual curiosity, practical skill development, and interdisciplinary collaboration.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Workshops & Seminars', desc: 'Participate in expert-led sessions covering cutting-edge technologies, academic disciplines, and professional development topics.', icon: '👨‍🏫' },
                { title: 'Hackathons & Competitions', desc: 'Engage in intensive problem-solving challenges, applying theoretical knowledge to real-world scenarios in a competitive environment.', icon: '💻' },
                { title: 'Guest Lectures & Panels', desc: 'Gain insights from thought leaders and industry pioneers, exploring diverse perspectives and emerging trends.', icon: '🎤' },
                { title: 'Collaborative Projects', desc: 'Join interdisciplinary teams to work on innovative projects, enhancing teamwork, communication, and project management skills.', icon: '💡' },
                { title: 'Mentorship Programs', desc: 'Access mentorship opportunities from experienced seniors or faculty, providing guidance and support for your academic and career trajectory.', icon: '👩‍🔬' },
                { title: 'Research Showcases', desc: 'Discover ongoing research, present your findings, and receive valuable feedback from the academic community.', icon: '🔬' },
              ].map((learn, idx) => (
                <div
                  key={idx}
                  className="bg-white bg-opacity-10 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out hover:-translate-y-2 backdrop-blur-sm"
                >
                  <div className="bg-green-400 text-green-900 w-16 h-16 flex items-center justify-center rounded-full text-3xl font-bold mx-auto mb-4 shadow-md">
                    {learn.icon}
                  </div>
                  <h3 className="font-bold text-2xl mb-2 text-gray-800">{learn.title}</h3>
                  <p className="text-gray-700 text-base">{learn.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="my-12 border-indigo-500 opacity-50" />

          {/* Key Features Section - Remains a grid, section header centered */}
          <section className="py-12 text-center">
            <h2 className="text-4xl font-bold mb-8">Core Capabilities of <span className="text-indigo-300">GLUBS</span></h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto opacity-90">
              GLUBS is equipped with a robust suite of features, meticulously designed to elevate every facet of event management and participant engagement, ensuring an exceptionally fluid and highly effective user experience.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Advanced QR Code Validation', desc: 'Facilitate exceptionally rapid and secure attendee check-ins through unique, dynamically generated QR codes, enhancing operational efficiency and security.', link: '/features/qr-registration' },
                { title: 'Integrated Financial Transaction Hub', desc: 'Manage event registration fees and all financial transactions seamlessly and securely, leveraging industry-standard payment solutions for utmost reliability.', link: '/features/secure-payments' },
                { title: 'Comprehensive Event Performance Analytics', desc: 'Access in-depth data visualizations and insightful metrics on event attendance, engagement levels, and overall performance, enabling data-driven decision-making.', link: '/features/event-analytics' },
                { title: 'Structured Feedback Collection System', desc: 'Implement an integrated mechanism for gathering invaluable post-event feedback, fostering continuous improvement and strategic refinement for subsequent initiatives.', link: '/features/feedback' },
                { title: 'Personalized User Management Portals', desc: 'Empower users with intuitive, tailored dashboards to effortlessly manage their event registrations, personal profiles, and organizational activities.', link: '/features/dashboard' },
                { title: 'Centralized Resource Repository', desc: 'Provide unified access to essential event documentation, detailed schedules, and critical information, consolidating resources for participant convenience.', link: '/features/resource-hub' },
              ].map((feature, idx) => (
                <Link to={feature.link} key={idx}>
                  <div
                    className="bg-white bg-opacity-10 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center cursor-pointer transform hover:scale-105 backdrop-blur-sm"
                  >
                    <h3 className="font-bold text-xl mb-3 text-indigo-700">{feature.title}</h3>
                    <p className="text-gray-600 text-base">{feature.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <hr className="my-12 border-indigo-500 opacity-50" />

          {/* Team Section - Remains a grid, section header centered */}
          <section className="py-12 text-center">
            <h2 className="text-4xl font-bold mb-8">Meet the Innovators Behind <span className="text-indigo-300">GLUBS</span></h2>
            <p className="text-lg mb-10 max-w-3xl mx-auto opacity-90">
              The driving force behind GLUBS is a dedicated team of professionals, united by a shared commitment to developing a leading-edge event management platform. Our collective expertise and synergistic vision ensure the delivery of unparalleled, seamless user experiences.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Mohan Gupta",
                  role: "Lead Backend Architect",
                  description: "Manages stringent data security protocols, optimizes large-scale dataset handling, and rigorously ensures data integrity and consistency across the entire platform.",
                  img: img1,
                },
                {
                  name: "Kushagra Saraf",
                  role: "Platform Engineering Lead",
                  description: "Spearheads the robust backend infrastructure, guaranteeing API reliability, and implementing scalable architectural solutions for sustained, high-performance operations.",
                  img: img1,
                },
                {
                  name: "Amit Rana",
                  role: "Principal UI/UX Strategist",
                  description: "Orchestrates intuitive user experiences with an acute focus on accessibility, cross-device responsiveness, and cutting-edge visual design principles.",
                  img: img1,
                },
                {
                  name: "Piyush Pratap",
                  role: "Senior Frontend Engineer",
                  description: "Develops advanced user interface functionalities, ensures comprehensive responsiveness across all devices, and establishes robust connectivity with backend services.",
                  img: img1,
                },
                {
                  name: "Manoj Sharma",
                  role: "Head of Community Engagement",
                  description: "Cultivates active user community interaction, meticulously gathers insights, and ensures continuous platform enhancement through structured feedback integration.",
                  img: img1,
                },
                {
                  name: "Milan Choudhary",
                  role: "Event & Growth Strategist",
                  description: "Designs high-impact event campaigns, conducts thorough trend analyses, and provides strategic guidance to organizations for optimizing participation and achieving objectives.",
                  img: img1,
                },
              ].map((member, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300 ease-in-out hover:-translate-y-2"
                >
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-indigo-200 shadow-md"
                  />
                  <h3 className="font-bold text-2xl mb-1 text-indigo-700">{member.name}</h3>
                  <p className="text-gray-600 font-medium mb-3 text-lg">{member.role}</p>
                  <p className="text-gray-700 text-base">{member.description}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;