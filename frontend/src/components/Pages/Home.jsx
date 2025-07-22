import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CountUp from 'react-countup';
import { IoSparkles, IoPeople, IoBulb, IoCalendar, IoBookmark, IoShareSocial, IoQrCode, IoNotifications, IoAnalytics } from 'react-icons/io5'; // Added more icons for features
import img2 from '../images/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.webp';
import event1 from '../images/EventA.jpg';
import event2 from '../images/EventB.jpg';
import event3 from '../images/EventC.jpg';
import backgroundhero from '../images/backgroundhero.avif';

export default function LandingPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  // Custom Tailwind animation for subtle entry
  const AnimateIntoView = ({ children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = React.useRef();

    useEffect(() => {
      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.unobserve(domRef.current);
        }
      }, { threshold: 0.1 }); // Trigger when 10% of the element is visible
      observer.observe(domRef.current);
      return () => domRef.current && observer.unobserve(domRef.current);
    }, []);

    return (
      <div
        className={`transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
        ref={domRef}
      >
        {children}
      </div>
    );
  };

  const trendingEvents = [
    { id: 1, title: 'Annual Tech Hackathon', details: 'Innovate and build the future of technology!', img: event1, date: 'Aug 10, 2025', attendees: '500+' },
    { id: 2, title: 'Design Thinking Workshop', details: 'Unlock creative solutions for real-world problems.', img: event2, date: 'Sep 5, 2025', attendees: '150+' },
    { id: 3, title: 'Career Fair 2025', details: 'Connect with leading companies and explore opportunities.', img: event3, date: 'Oct 1, 2025', attendees: '1000+' },
    { id: 4, title: 'Startup Pitch Competition', details: 'Present your groundbreaking ideas to investors!', img: event1, date: 'Nov 15, 2025', attendees: '80+' },
    { id: 5, title: 'Photography Masterclass', details: 'Learn advanced techniques from professional photographers.', img: event2, date: 'Dec 1, 2025', attendees: '120+' },
  ];

  const studentLeaderboard = [
    { id: 1, name: 'Alice Johnson', events: 12, role: 'Top Attendee', avatar: img2, badgeColor: 'bg-yellow-500', icon: <IoSparkles /> },
    { id: 2, name: 'Bob Smith', events: 10, role: 'Active Participant', avatar: img2, badgeColor: 'bg-gray-400', icon: <IoPeople /> },
    { id: 3, name: 'Charlie Brown', events: 8, role: 'Community Organizer', avatar: img2, badgeColor: 'bg-purple-500', icon: <IoBulb /> },
    { id: 4, name: 'Diana Prince', events: 7, role: 'Rising Star', avatar: img2, badgeColor: 'bg-green-500', icon: <IoCalendar /> },
  ];

  const smartFeatures = [
    {
      icon: <IoQrCode />,
      title: 'QR Code Check-ins',
      description: 'Streamline event entry and attendance tracking with quick and secure QR code scanning.'
    },
    {
      icon: <IoNotifications />,
      title: 'Personalized Notifications',
      description: 'Receive tailored alerts for events matching your interests and important updates.'
    },
    {
      icon: <IoAnalytics />,
      title: 'Event Analytics (Organizers)',
      description: 'Gain insights into event performance, attendance trends, and participant engagement.'
    },
    {
      icon: <IoBookmark />,
      title: 'Favorite & Watchlist',
      description: 'Save events you are interested in and create a personalized watchlist for easy access.'
    },
    {
      icon: <IoShareSocial />,
      title: 'Social Sharing',
      description: 'Easily share events with friends and colleagues across your social networks.'
    },
    {
      icon: <IoCalendar />,
      title: 'Calendar Integration',
      description: 'Add events directly to your personal calendar to never miss an opportunity.'
    },
  ];

  return (
    <div className="flex flex-col min-h-screen font-poppins bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center md:items-center justify-start text-left px-4 md:pl-20 pl-4 bg-gradient-to-b from-black via-indigo-900 to-black text-white transition-all duration-700 ease-in-out overflow-hidden">
        <div className="flex-1 flex flex-col justify-center items-start h-full md:min-h-screen md:py-0 py-12 z-10">
          <AnimateIntoView>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 pl-2 md:pl-4 leading-tight">
              Gateway to Campus Opportunities
            </h1>
          </AnimateIntoView>
          <AnimateIntoView delay={200}>
            <p className="text-lg md:text-2xl text-gray-300 mb-8 max-w-xl pl-2 md:pl-4">
              Discover, register, and attend university events, hackathons, and workshops to level up your campus journey.
            </p>
          </AnimateIntoView>
          <AnimateIntoView delay={400}>
            <div className="flex gap-4 flex-wrap justify-start pl-2 md:pl-4">
              <Link
                to="/events"
                className="bg-white text-indigo-700 font-semibold rounded-full px-6 py-3 hover:bg-indigo-700 hover:text-white transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 hover:scale-105"
              >
                Explore Events
              </Link>
              <Link
                to="/features/Organizers"
                className="border border-white text-white font-semibold rounded-full px-6 py-3 hover:bg-white hover:text-indigo-700 transition-all duration-300 shadow-lg hover:shadow-white/20 hover:scale-105"
              >
                For Organizers
              </Link>
            </div>
          </AnimateIntoView>
        </div>
        <div className="flex-1 flex justify-center items-center mt-8 md:mt-0 z-0">
          <AnimateIntoView delay={600}>
            <img src={backgroundhero} alt="Hero" className="w-full max-w-xl rounded-xl object-cover shadow-2xl hover:shadow-indigo-500/50 transition-shadow duration-300" />
          </AnimateIntoView>
        </div>
      </section>

      {/* Animated Stat Counters */}
      <section className="w-full py-16 px-4 bg-gradient-to-t from-black via-indigo-900 to-black text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <AnimateIntoView delay={100}>
            <div className="flex flex-col items-center p-8 rounded-2xl bg-[#111827] shadow-xl border border-indigo-700 hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-2">
              <IoSparkles className="text-6xl text-cyan-400 mb-4 animate-pulse-slow" />
              <div className="text-6xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                <CountUp end={500} duration={2.5} enableScrollSpy scrollSpyOnce />+
              </div>
              <p className="text-xl text-gray-300">Events Hosted</p>
            </div>
          </AnimateIntoView>
          <AnimateIntoView delay={200}>
            <div className="flex flex-col items-center p-8 rounded-2xl bg-[#111827] shadow-xl border border-indigo-700 hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-2">
              <IoPeople className="text-6xl text-cyan-400 mb-4 animate-pulse-slow" />
              <div className="text-6xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                <CountUp end={15000} duration={2.5} enableScrollSpy scrollSpyOnce />+
              </div>
              <p className="text-xl text-gray-300">Participants Registered</p>
            </div>
          </AnimateIntoView>
          <AnimateIntoView delay={300}>
            <div className="flex flex-col items-center p-8 rounded-2xl bg-[#111827] shadow-xl border border-indigo-700 hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-2">
              <IoBulb className="text-6xl text-cyan-400 mb-4 animate-pulse-slow" />
              <div className="text-6xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                <CountUp end={120} duration={2.5} enableScrollSpy scrollSpyOnce />+
              </div>
              <p className="text-xl text-gray-300">Workshops Conducted</p>
            </div>
          </AnimateIntoView>
        </div>
      </section>

      {/* Trending Events Carousel */}
      <section className="w-full py-20 px-4 bg-gradient-to-b from-black via-indigo-900 to-black text-white">
        <div className="max-w-6xl mx-auto">
          <AnimateIntoView>
            <h2 className="text-3xl md:text-6xl font-bold mb-8 text-white text-left tracking-wider">Trending Events</h2>
          </AnimateIntoView>
          <AnimateIntoView delay={200}>
            <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {trendingEvents.map((event) => (
                <div key={event.id} className="flex-none w-72 md:w-80 bg-[#181c23] rounded-2xl p-5 shadow-lg border border-transparent transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-cyan-500 group">
                  <img src={event.img} alt={event.title} className="rounded-xl w-full h-44 object-cover mb-4 shadow-md group-hover:shadow-lg transition-shadow" />
                  <div className="flex flex-col">
                    <h3 className="font-bold text-xl text-white mb-2 group-hover:text-cyan-400 transition-colors leading-snug">{event.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.details}</p>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <IoCalendar className="mr-2 text-indigo-400" /> {event.date}
                      <IoPeople className="ml-4 mr-2 text-indigo-400" /> {event.attendees}
                    </div>
                    <Link to={`/events/${event.id}`}
                      className="mt-auto bg-indigo-700 text-white text-md px-5 py-2 rounded-full hover:bg-indigo-600 transition-colors self-start shadow"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </AnimateIntoView>
        </div>
      </section>

      {/* Smart Features Section - Replaces Event Gallery */}
      <section className="w-full bg-gradient-to-b from-black via-indigo-900 to-black py-20 text-white">
        <div className="max-w-6xl mx-auto">
          <AnimateIntoView>
            <h2 className="text-3xl md:text-6xl font-bold mb-12 text-white text-center tracking-wider">Smart Features for You</h2>
          </AnimateIntoView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {smartFeatures.map((feature, idx) => (
              <AnimateIntoView delay={idx * 150} key={idx}>
                <div className="bg-[#111827] rounded-2xl p-8 flex flex-col items-center text-center shadow-xl border border-transparent hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-2">
                  <span className="text-7xl text-cyan-400 mb-6">{feature.icon}</span>
                  <h3 className="font-bold text-2xl text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 text-base">{feature.description}</p>
                </div>
              </AnimateIntoView>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-20 px-4 bg-black text-white">
        {/* Heading Row */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16">
          <AnimateIntoView>
            <h2 className="text-4xl md:text-6xl font-bold text-left mb-6 md:mb-0 whitespace-pre-line leading-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">What people are saying about us.</h2>
          </AnimateIntoView>
        </div>
        {/* Testimonials Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              img: img2,
              text: '"GLUBS increased our event turnout by 300%! The QR system made attendance tracking so easy and efficient."',
              name: 'Mark Zuckerberg',
              title: 'Event Organizer'
            },
            {
              img: img2,
              text: '"Finally, I never miss events! The intuitive dashboard keeps me updated on everything exciting happening on campus."',
              name: 'Katrina Kaif',
              title: 'Student User'
            },
            {
              img: img2,
              text: '"This platform made it incredibly easy to find and join events relevant to my interests. Highly recommended for all students!"',
              name: 'Johny Bhai',
              title: 'Student Attendee'
            }
          ].map((item, idx) => (
            <AnimateIntoView delay={idx * 150} key={idx}>
              <div key={idx} className="bg-[#111827] rounded-2xl p-8 flex flex-col h-full shadow-xl border border-indigo-700 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1">
                <span className="text-cyan-400 text-6xl mb-4 font-serif leading-none">&ldquo;</span>
                <p className="text-white text-lg mb-8 italic flex-grow">{item.text}</p>
                <div className="flex items-center mt-auto">
                  <img src={item.img} alt={item.name} className="w-14 h-14 rounded-full border-3 border-cyan-400 mr-4 object-cover shadow-md" />
                  <div>
                    <h3 className="font-bold text-white text-lg">{item.name}</h3>
                    <p className="text-gray-400 text-sm">{item.title}</p>
                  </div>
                </div>
              </div>
            </AnimateIntoView>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-black text-white py-20 px-4 flex flex-col md:flex-row items-center md:items-stretch">
        {/* Left: Steps List */}
        <div className="flex-1 flex flex-col gap-10 pl-10 md:pl-32">
          {[
            {
              icon: (
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-900 text-cyan-300 text-3xl mr-6 shadow-lg">
                  ★
                </span>
              ),
              title: 'Discover',
              desc: 'Browse campus events, hackathons, and workshops effortlessly.'
            },
            {
              icon: (
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-900 text-cyan-300 text-3xl mr-6 shadow-lg">
                  ✔
                </span>
              ),
              title: 'Register',
              desc: 'Enjoy quick and seamless registration with instant confirmation.'
            },
            {
              icon: (
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-900 text-cyan-300 text-3xl mr-6 shadow-lg">
                  🕒
                </span>
              ),
              title: 'Attend',
              desc: 'Experience hassle-free entry with QR code check-in for all events.'
            },
            {
              icon: (
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-900 text-cyan-300 text-3xl mr-6 shadow-lg">
                  🏆
                </span>
              ),
              title: 'Get Recognized',
              desc: 'Receive digital certificates and build an impressive profile.'
            }
          ].map((item, idx) => (
            <AnimateIntoView delay={idx * 100} key={idx}>
              <div className="flex items-start bg-[#111827] p-6 rounded-xl shadow-lg border border-transparent hover:border-indigo-500 transition-all duration-300">
                {item.icon}
                <div>
                  <h3 className="text-2xl font-semibold mb-1 text-white">{item.title}</h3>
                  <p className="text-gray-300 text-lg">{item.desc}</p>
                </div>
              </div>
            </AnimateIntoView>
          ))}
        </div>
        {/* Right: Heading */}
        <div className="flex-1 flex items-center justify-center mb-10 md:mb-0">
          <AnimateIntoView delay={400}>
            <h2 className="text-4xl md:text-6xl font-bold text-left md:text-center w-full leading-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">How it Works</h2>
          </AnimateIntoView>
        </div>
      </section>

      {/* Call To Action */}
      <section className="w-full bg-gradient-to-b from-black via-indigo-900 to-indigo-900 text-white text-center py-16 px-6">
        <AnimateIntoView>
          <div className="w-4/5 mx-auto">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl flex flex-col items-center space-y-8 animate-gradient-border">
              <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300">Enroll in Opportunities Today</h2>
              <p className="text-purple-100 max-w-2xl mx-auto text-lg">
                Start your journey by participating in campus events, workshops, and hackathons to enhance your skills and network with like-minded peers. Don't miss out on your next big opportunity!
              </p>
              <Link
                to="/contact"
                className="inline-block bg-white text-indigo-800 font-semibold rounded-full px-8 py-4 text-lg hover:bg-indigo-700 hover:text-white transition-all duration-300 shadow-xl hover:shadow-indigo-500/50 hover:scale-105"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </AnimateIntoView>
      </section>

      <Footer />

      {/* Sticky Quick Access Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-90 backdrop-blur-md text-white py-3 px-4 shadow-lg z-40 md:hidden border-t border-indigo-700">
        <ul className="flex justify-around items-center">
          <li>
            <Link to="/events" className="flex flex-col items-center text-xs hover:text-cyan-400 transition-colors p-1">
              <IoCalendar className="text-xl mb-1" />
              <span>Events</span>
            </Link>
          </li>
          <li>
            <Link to="/organize" className="flex flex-col items-center text-xs hover:text-cyan-400 transition-colors p-1">
              <IoBookmark className="text-xl mb-1" />
              <span>Organize</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className="flex flex-col items-center text-xs hover:text-cyan-400 transition-colors p-1">
              <IoPeople className="text-xl mb-1" />
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}