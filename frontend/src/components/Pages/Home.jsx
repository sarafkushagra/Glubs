"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../Context/ThemeContext"
import Navbar from "./Navbar"
// import img2 from "../images/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.webp" // Not used in this section anymore
import event1 from "../images/EventA.jpg"
import event2 from "../images/EventB.jpg"
import event3 from "../images/EventC.jpg"
import backgroundhero from "../images/backgroundhero.avif"
import Footer from "./Footer"

// Define celebrity images (Public URLs)
const rdjImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/440px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg"
const emmaImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Emma_Stone_at_Maniac_UK_premiere_%28cropped%29.jpg/440px-Emma_Stone_at_Maniac_UK_premiere_%28cropped%29.jpg"
const ruskinImg = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfjk9hGhqMmFLSy_EUtXmCgVNdT34fNOliK0P6x1zS82jQn8Fof-Egorp8IrlSdygcaLkFEQ&s"

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
      {/* Inline style block for keyframes - Generally not recommended for production */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-slide-in-up {
          animation: slideInUp 0.8s ease-out forwards;
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out forwards;
        }

        /* Utility for animation delay */
        .animate-delay-0_1s { animation-delay: 0.1s; }
        .animate-delay-0_2s { animation-delay: 0.2s; }
        .animate-delay-0_3s { animation-delay: 0.3s; }
        .animate-delay-0_4s { animation-delay: 0.4s; }
        .animate-delay-0_5s { animation-delay: 0.5s; }
        .animate-delay-0_6s { animation-delay: 0.6s; }
        .animate-delay-0_7s { animation-delay: 0.7s; }
        .animate-delay-0_8s { animation-delay: 0.8s; }
      `}</style>

      <Navbar />

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex flex-col md:flex-row items-center md:items-center justify-start text-left px-4 md:pl-20 py-12 md:py-0 transition-all duration-700 ease-in-out"
        style={themeStyles.heroSection}
      >
        <div className="flex-1 flex flex-col justify-center items-start h-full md:min-h-screen">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 pl-2 md:pl-4 text-center md:text-left w-full"
            style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}
          >
            Gateway to Campus Opportunities
          </h1>
          <p
            className="text-lg sm:text-xl md:text-2xl mb-8 max-w-xl pl-2 md:pl-4 text-center md:text-left w-full"
            style={{ color: theme === "dark" ? "#d1d5db" : "#6b7280" }}
          >
            Discover, register, and attend university events, hackathons, and workshops to level up your campus journey.
          </p>
          <div className="flex gap-4 flex-wrap justify-center md:justify-start w-full px-2 md:px-4">
            <Link
              to="/events"
              className="font-semibold rounded-full px-6 py-3 transition-all duration-300 shadow hover:scale-105 flex-grow sm:flex-grow-0 text-center"
              style={{
                backgroundColor: theme === "dark" ? "#ffffff" : "#4f46e5",
                color: theme === "dark" ? "#4f46e5" : "#ffffff",
              }}
            >
              Explore Events
            </Link>
            <Link
              to="/features"
              className="border font-semibold rounded-full px-6 py-3 transition-all duration-300 shadow hover:scale-105 flex-grow sm:flex-grow-0 text-center"
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
        <div className="flex-1 flex justify-center items-center mt-8 md:mt-0 px-4 md:px-0">
          <img
            src={backgroundhero || "/placeholder.svg"}
            alt="Hero"
            className="w-full max-w-sm sm:max-w-md md:max-w-xl rounded-xl object-cover"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section
        className="w-full py-20 px-4 flex flex-col md:flex-row items-center md:items-stretch"
        style={themeStyles.howItWorksSection}
      >
        {/* Left: Steps List */}
        <div className="flex-1 flex flex-col gap-8 md:gap-10 pl-0 md:pl-32 order-2 md:order-1 mt-10 md:mt-0">
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
            <div key={idx} className="flex items-start animate-slide-in-up" style={{ animationDelay: `${idx * 0.15 + 0.3}s` }}>
              <span
                className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full text-2xl sm:text-3xl mr-4 sm:mr-6 flex-shrink-0"
                style={{
                  backgroundColor: theme === "dark" ? "#312e81" : "#e0e7ff",
                  color: theme === "dark" ? "#06b6d4" : "#4f46e5",
                }}
              >
                {item.icon}
              </span>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-1" style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}>
                  {item.title}
                </h3>
                <p className="text-base sm:text-lg" style={{ color: theme === "dark" ? "#d1d5db" : "#6b7280" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Right: Heading */}
        <div className="flex-1 flex items-center justify-center mb-10 md:mb-0 order-1 md:order-2 animate-fade-in animate-delay-0_2s">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-center md:text-left w-full"
            style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}
          >
            How it Works
          </h2>
        </div>
      </section>

      {/* Event Gallery */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8" style={themeStyles.eventGallerySection}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-8 text-left animate-fade-in animate-delay-0_1s"
            style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}
          >
            Event Gallery
          </h2>
          <div className="flex flex-wrap justify-center sm:justify-start gap-6">
            {[event1, event2, event3, event1].map((img, idx) => (
              <div
                key={idx}
                className="rounded-xl p-4 w-[calc(50%-0.75rem)] sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.33rem)] lg:w-56 shadow-lg transform transition-transform duration-300 hover:scale-105 animate-slide-in-up"
                style={{
                  backgroundColor: theme === "dark" ? "#181c23" : "#ffffff",
                  border: theme === "dark" ? "1px solid #374151" : "1px solid #e5e7eb",
                  animationDelay: `${idx * 0.1}s`, // Staggered animation
                }}
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`Event ${idx + 1}`}
                  className="rounded-lg w-full h-40 sm:h-56 object-cover mb-2"
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
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8" style={themeStyles.testimonialsSection}>
        {/* Heading Row */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16 animate-fade-in">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-center md:text-left mb-6 md:mb-0 whitespace-pre-line"
            style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}
          >
            What people are saying about us.
          </h2>
        </div>
        {/* Testimonials Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              img: rdjImg, // Updated to Robert Downey Jr.
              text: '"GLUBS increased our event turnout by 300%! The QR system made attendance tracking so easy."',
              name: "Robert Downey Jr.",
            },
            {
              img: emmaImg,
              text: '"Finally, I never miss events. The dashboard keeps me updated on everything happening on campus."',
              name: "Karan Kaif",
            },
            {
              img: ruskinImg,
              text: '"This platform made it so easy to find and join events. Highly recommended!"',
              name: "Manoj Malhotra",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-6 sm:p-8 flex flex-col h-full shadow-lg transform transition-transform duration-300 hover:scale-[1.02] animate-slide-in-up"
              style={{
                backgroundColor: theme === "dark" ? "#111827" : "#ffffff",
                border: theme === "dark" ? "1px solid #374151" : "1px solid #e5e7eb",
                animationDelay: `${idx * 0.1}s`, // Staggered animation
              }}
            >
              <span className="text-4xl sm:text-5xl mb-4" style={{ color: theme === "dark" ? "#06b6d4" : "#4f46e5" }}>
                &ldquo;
              </span>
              <p className="text-base sm:text-lg mb-6 sm:mb-8" style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}>
                {item.text}
              </p>
              <div className="flex items-center mt-auto">
                <img
                  src={item.img || "/placeholder.svg"}
                  alt={item.name}
                  // Added object-cover here to ensure the image fits the circle perfectly without stretching
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 mr-3 sm:mr-4 object-cover"
                  style={{
                    borderColor: theme === "dark" ? "#06b6d4" : "#4f46e5",
                  }}
                />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base" style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}>
                    {item.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="w-full text-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in" style={themeStyles.ctaSection}>
        <div className="w-full max-w-6xl mx-auto">
          <div
            className="backdrop-blur-md rounded-2xl p-6 sm:p-10 shadow-lg flex flex-col items-center space-y-4 sm:space-y-6 animate-slide-in-up animate-delay-0_2s"
            style={{
              backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.7)",
              border: theme === "dark" ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid #e5e7eb",
            }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: theme === "dark" ? "#ffffff" : "#111827" }}>
              Enroll in Opportunities Today
            </h2>
            <p className="max-w-xl mx-auto text-sm sm:text-base" style={{ color: theme === "dark" ? "#c4b5fd" : "#6b7280" }}>
              Start your journey by participating in campus events, workshops, and hackathons to enhance your skills and
              network with like-minded peers.
            </p>
            <Link
              to="/contact"
              className="inline-block font-semibold rounded-full px-5 py-2 sm:px-6 sm:py-3 transition-all duration-300 shadow hover:scale-105 text-sm sm:text-base"
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