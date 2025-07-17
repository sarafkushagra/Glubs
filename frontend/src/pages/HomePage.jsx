import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this

import {
  Search,
  Users,
  CalendarCheck,
  Award,
  Bot,
  LayoutDashboard,
  BarChart3,
  Megaphone,
  FileCheck,
} from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const features = [
  {
    title: "Discover",
    icon: <Search size={32} />,
    desc: "Browse through exciting campus events tailored to your interests.",
  },
  {
    title: "Register",
    icon: <Users size={32} />,
    desc: "Quick and easy registration with smart QR code generation.",
  },
  {
    title: "Attend",
    icon: <CalendarCheck size={32} />,
    desc: "Seamless check-in using your personalized QR code.",
  },
  {
    title: "Get Recognized",
    icon: <Award size={32} />,
    desc: "Receive automatic e-certificates and build your portfolio.",
  },
];

const smartFeatures = [
  {
    title: "Smart QR Entry",
    icon: <Search size={32} />,
    desc: "Lightning-fast check-in with personalized QR codes.",
  },
  {
    title: "Auto E-Certificates",
    icon: <FileCheck size={32} />,
    desc: "Instant certificate generation upon event completion.",
  },
  {
    title: "Built-in Chatbot",
    icon: <Bot size={32} />,
    desc: "24/7 AI assistant to answer questions and guide users.",
  },
];

const clubFeatures = [
  {
    title: "Centralized Dashboard",
    icon: <LayoutDashboard size={28} />,
    desc: "Manage all your events from one interface.",
  },
  {
    title: "Live Attendance Stats",
    icon: <BarChart3 size={28} />,
    desc: "Real-time insights into participation and engagement.",
  },
  {
    title: "Easy Promotion",
    icon: <Megaphone size={28} />,
    desc: "Built-in marketing tools to reach your audience.",
  },
  {
    title: "Certificate Automation",
    icon: <FileCheck size={28} />,
    desc: "Automatic certificate generation and distribution.",
  },
];

const events = [
  {
    title: "Annual Tech Summit 2024",
    date: "March 15, 2024",
    students: "250+",
    img: "https://source.unsplash.com/featured/?technology",
  },
  {
    title: "Cultural Fest Celebration",
    date: "March 20, 2024",
    students: "400+",
    img: "https://source.unsplash.com/featured/?festival",
  },
  {
    title: "Sports Championship",
    date: "March 25, 2024",
    students: "180+",
    img: "https://source.unsplash.com/featured/?sports",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = () => {
      navigate("/auth");
    };

    // Add global click listener
    window.addEventListener("click", handleClick);

    // Cleanup
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="font-sans text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navbar Section
        <Navbar/> */}

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-600 to-white h-[70vh] dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 py-20 px-4 text-center text-white dark:text-white transition-colors duration-300">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow">
          Gateway to{" "}
          <span className="text-blue-300 dark:text-blue-400">
            Campus Opportunities
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-lg md:text-xl text-gray-100 dark:text-gray-300 mb-8">
          Discover, register, and attend university events, hackathons, and
          workshops to level up your campus journey.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium shadow-md transition-transform hover:scale-105">
            Explore Events
          </button>
          <button className="border border-blue-300 text-blue-100 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-200 dark:hover:text-blue-900 px-6 py-2 rounded-full font-medium transition-transform hover:scale-105">
            For Organizers
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white dark:bg-gray-900 text-center">
        <h2 className="text-3xl font-semibold mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md shadow hover:shadow-xl hover:scale-105 transition duration-300"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Features */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950 text-center">
        <h2 className="text-3xl font-semibold mb-12">Smart Features</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
          {smartFeatures.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md shadow hover:shadow-xl hover:scale-105 transition duration-300"
            >
              <div className="text-green-600 dark:text-green-400 mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Clubs Will Love GLUBS */}
      <section className="py-16 bg-white dark:bg-gray-900 text-center">
        <h2 className="text-3xl font-semibold mb-12">
          Why Clubs Will Love GLUBS
        </h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
          {clubFeatures.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md shadow hover:shadow-xl hover:scale-105 transition duration-300"
            >
              <div className="text-purple-600 dark:text-purple-400 mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Event Gallery */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950 text-center">
        <h2 className="text-3xl font-semibold mb-12">Event Gallery Preview</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="rounded-md overflow-hidden shadow hover:shadow-xl hover:scale-105 transition bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            >
              <img
                src={event.img}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {event.date}
                </p>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-200">
                  {event.students} students
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-900 text-center">
        <h2 className="text-3xl font-semibold mb-12">
          What Our Community Says
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-white rounded-md shadow hover:shadow-xl hover:scale-105 transition">
            <p className="text-lg italic">
              "GLUBS increased our event turnout by 200%! The automated
              certificate system saves us hours of work."
            </p>
            <p className="mt-4 font-bold">
              Alex Chen{" "}
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                – Tech Club Lead
              </span>
            </p>
          </div>
          <div className="p-6 bg-blue-50 dark:bg-blue-900/30 text-gray-900 dark:text-white rounded-md shadow hover:shadow-xl hover:scale-105 transition">
            <p className="text-lg italic">
              "Finally, I never miss events anymore! The notifications and QR
              check-in make everything so smooth."
            </p>
            <p className="mt-4 font-bold">
              Sarah Patel{" "}
              <span className="text-gray-600 dark:text-gray-300 text-sm">
                – 3rd Year CSE Student
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-700 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
        <p className="mb-6">
          Join thousands of students already using GLUBS to enhance their campus
          experience
        </p>
        <button className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-md hover:scale-105 hover:shadow-md transition">
          Register as Student
        </button>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
