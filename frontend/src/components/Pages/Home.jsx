"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../Context/ThemeContext"
import Navbar from "./Navbar"
import img2 from "../images/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.webp"
import event1 from "../images/EventA.jpg"
import event2 from "../images/EventB.jpg"
import event3 from "../images/EventC.jpg"
import backgroundhero from "../images/backgroundhero.avif"
import Footer from "./Footer"

export default function LandingPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const { theme } = useTheme()
  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  // Theme-based styles
  const themeStyles = {
    container: {
      backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
      color: theme === "dark" ? "#f8fafc" : "#1f2937",
    },
    heroSection: {
      background:
        theme === "dark"
          ? "linear-gradient(to bottom, #000000, #312e81, #000000)"
          : "linear-gradient(to bottom, #dbeafe, #ffffff, #e0e7ff)",
      color: theme === "dark" ? "#ffffff" : "#111827",
    },
    howItWorksSection: {
      backgroundColor: theme === "dark" ? "#000000" : "#f9fafb",
      color: theme === "dark" ? "#ffffff" : "#111827",
    },
    eventGallerySection: {
      background:
        theme === "dark"
          ? "linear-gradient(to bottom, #000000, #312e81, #000000)"
          : "linear-gradient(to bottom, #ffffff, #dbeafe, #ffffff)",
      color: theme === "dark" ? "#ffffff" : "#111827",
    },
    testimonialsSection: {
      backgroundColor: theme === "dark" ? "#000000" : "#f9fafb",
      color: theme === "dark" ? "#ffffff" : "#111827",
    },
    ctaSection: {
      background:
        theme === "dark"
          ? "linear-gradient(to bottom, #000000, #312e81, #312e81)"
          : "linear-gradient(to bottom, #dbeafe, #c7d2fe, #a5b4fc)",
      color: theme === "dark" ? "#ffffff" : "#111827",
    },
  }

  return (
    <div className="flex flex-col min-h-screen font-poppins" style={themeStyles.container}>
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex flex-col md:flex-row items-center md:items-center justify-start text-left px-4 md:pl-20 pl-4 transition-all duration-700 ease-in-out"
        style={themeStyles.heroSection}
      >
        <div className="flex-1 flex flex-col justify-center items-start h-full md:min-h-screen md:py-0 py-12">
          <h1
            className="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in-down pl-2 md:pl-4"
            style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}
          >
            Gateway to Campus Opportunities
          </h1>
          <p
            className="text-lg md:text-2xl mb-8 max-w-xl animate-fade-in-up pl-2 md:pl-4"
            style={{ color: theme === "dark" ? "#d1d5db" : "#6b7280" }}
          >
            Discover, register, and attend university events, hackathons, and workshops to level up your campus journey.
          </p>
          <div className="flex gap-4 flex-wrap justify-start animate-fade-in-up pl-2 md:pl-4">
            <Link
              to="/events"
              className="font-semibold rounded-full px-6 py-3 transition-all duration-300 shadow hover:scale-105"
              style={{
                backgroundColor: theme === "dark" ? "#ffffff" : "#4f46e5",
                color: theme === "dark" ? "#4f46e5" : "#ffffff",
              }}
            >
              Explore Events
            </Link>
            <Link
              to="/features"
              className="border font-semibold rounded-full px-6 py-3 transition-all duration-300 shadow hover:scale-105"
              style={{
                borderColor: theme === "dark" ? "#ffffff" : "#4f46e5",
                color: theme === "dark" ? "#ffffff" : "#4f46e5",
                backgroundColor: "transparent",
              }}
            >
              Explore Features
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center mt-8 md:mt-0">
          <img
            src={backgroundhero || "/placeholder.svg"}
            alt="Hero"
            className="w-full max-w-xl rounded-xl object-cover"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section
        className="w-full py-20 px-4 flex flex-col md:flex-row items-center md:items-stretch"
        style={themeStyles.howItWorksSection}
      >
        {/* Left: Steps List */}
        <div className="flex-1 flex flex-col gap-10 pl-10 md:pl-32">
          {[
            {
              icon: "★",
              title: "Discover",
              desc: "Browse campus events, hackathons, and workshops",
            },
            {
              icon: "✔",
              title: "Register",
              desc: "Quick registration and instant confirmation",
            },
            {
              icon: "🕒",
              title: "Attend",
              desc: "QR check-in for seamless attendance",
            },
            {
              icon: "🏆",
              title: "Get Recognized",
              desc: "Receive certificates and build your profile",
            },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start">
              <span
                className="inline-flex items-center justify-center w-14 h-14 rounded-full text-3xl mr-6"
                style={{
                  backgroundColor: theme === "dark" ? "#312e81" : "#e0e7ff",
                  color: theme === "dark" ? "#06b6d4" : "#4f46e5",
                }}
              >
                {item.icon}
              </span>
              <div>
                <h3 className="text-2xl font-semibold mb-1" style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}>
                  {item.title}
                </h3>
                <p className="text-lg" style={{ color: theme === "dark" ? "#d1d5db" : "#6b7280" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Right: Heading */}
        <div className="flex-1 flex items-center justify-center mb-10 md:mb-0">
          <h2
            className="text-4xl md:text-6xl font-bold text-left md:text-center w-full"
            style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}
          >
            How it Works
          </h2>
        </div>
      </section>

      {/* Event Gallery */}
      <section className="w-full py-20" style={themeStyles.eventGallerySection}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl md:text-6xl font-bold mb-8 text-left"
            style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}
          >
            Event Gallery
          </h2>
          <div className="flex gap-6 flex-wrap justify-start">
            {[event1, event2, event3, event1].map((img, idx) => (
              <div
                key={idx}
                className="rounded-xl p-4 w-56 shadow-lg"
                style={{
                  backgroundColor: theme === "dark" ? "#181c23" : "#ffffff",
                  border: theme === "dark" ? "1px solid #374151" : "1px solid #e5e7eb",
                }}
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`Event ${idx + 1}`}
                  className="rounded-lg w-full h-56 object-cover mb-2"
                />
                <div>
                  <h3 className="font-bold text-base mb-1" style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}>
                    Event Title
                  </h3>
                  <p className="text-xs" style={{ color: theme === "dark" ? "#9ca3af" : "#6b7280" }}>
                    Subtitle or attendees
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-20 px-4" style={themeStyles.testimonialsSection}>
        {/* Heading Row */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16">
          <h2
            className="text-4xl md:text-6xl font-bold text-left mb-6 md:mb-0 whitespace-pre-line"
            style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}
          >
            What people are saying about us.
          </h2>
        </div>
        {/* Testimonials Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              img: img2,
              text: '"GLUBS increased our event turnout by 300%! The QR system made attendance tracking so easy."',
              name: "Mark Zuckerberg",
            },
            {
              img: img2,
              text: '"Finally, I never miss events. The dashboard keeps me updated on everything happening on campus."',
              name: "Katrina Kaif",
            },
            {
              img: img2,
              text: '"This platform made it so easy to find and join events. Highly recommended!"',
              name: "Johny Bhai",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-8 flex flex-col h-full shadow-lg"
              style={{
                backgroundColor: theme === "dark" ? "#111827" : "#ffffff",
                border: theme === "dark" ? "1px solid #374151" : "1px solid #e5e7eb",
              }}
            >
              <span className="text-5xl mb-4" style={{ color: theme === "dark" ? "#06b6d4" : "#4f46e5" }}>
                &ldquo;
              </span>
              <p className="text-lg mb-8" style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}>
                {item.text}
              </p>
              <div className="flex items-center mt-auto">
                <img
                  src={item.img || "/placeholder.svg"}
                  alt={item.name}
                  className="w-12 h-12 rounded-full border-2 mr-4"
                  style={{
                    borderColor: theme === "dark" ? "#06b6d4" : "#4f46e5",
                  }}
                />
                <div>
                  <h3 className="font-semibold" style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}>
                    {item.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="w-full text-center py-16 px-6" style={themeStyles.ctaSection}>
        <div className="w-4/5 mx-auto">
          <div
            className="backdrop-blur-md rounded-2xl p-10 shadow-lg flex flex-col items-center space-y-6"
            style={{
              backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.7)",
              border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid #e5e7eb",
            }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}>
              Enroll in Opportunities Today
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: theme === "dark" ? "#c4b5fd" : "#6b7280" }}>
              Start your journey by participating in campus events, workshops, and hackathons to enhance your skills and
              network with like-minded peers.
            </p>
            <Link
              to="/contact"
              className="inline-block font-semibold rounded-full px-6 py-3 transition-all duration-300 shadow hover:scale-105"
              style={{
                backgroundColor: theme === "dark" ? "#ffffff" : "#4f46e5",
                color: theme === "dark" ? "#4f46e5" : "#ffffff",
              }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
