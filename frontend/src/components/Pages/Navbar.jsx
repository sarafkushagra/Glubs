import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { QrCode } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { title: "Home", to: "/" },
    { title: "About", to: "/about" },
    { title: "Events", to: "/events" },
    { title: "Login", to: "/auth", isButton: true }
  ];

  return (
    <nav className="w-full flex py-6 px-6 justify-between items-center bg-black/40 backdrop-blur-md fixed top-0 z-50 font-poppins">
      {/* Logo */}
      <Link to="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
          alt="logo"
          className="w-[124px] h-[32px] object-contain"
        />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex justify-end items-center flex-1 space-x-8">
        {navLinks.map((nav) => (
          <li key={nav.to} className="relative group">
            <Link
              to={nav.to}
              className={`text-[16px] font-medium transition ${
                nav.isButton
                  ? "bg-white text-indigo-700 px-4 py-1.5 rounded-md hover:bg-indigo-100"
                  : location.pathname === nav.to
                  ? "text-white"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              {nav.title}
            </Link>
            {!nav.isButton && (
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
            )}
          </li>
        ))}

        {/* QR Icon */}
        <li>
          <Link
            to="/dashboard/scan"
            title="Mark Attendance"
            className="text-indigo-400 hover:text-indigo-600 transition"
          >
            <QrCode className="w-6 h-6" />
          </Link>
        </li>
      </ul>

      {/* Mobile Menu Icon */}
      <div className="sm:hidden flex items-center">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-2xl focus:outline-none"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden absolute top-20 right-4 bg-white p-6 rounded-xl shadow-lg min-w-[180px] z-50">
          <ul className="flex flex-col space-y-4">
            {navLinks.map((nav) => (
              <li key={nav.to}>
                <Link
                  to={nav.to}
                  onClick={() => setMenuOpen(false)}
                  className={`text-[16px] font-medium ${
                    nav.isButton
                      ? "bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                      : location.pathname === nav.to
                      ? "text-indigo-700 font-semibold"
                      : "text-gray-700 hover:text-indigo-700"
                  }`}
                >
                  {nav.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/scan"
                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <QrCode className="w-5 h-5" />
                Mark Attendance
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
