import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import React from 'react';
import { QrCode } from 'lucide-react';



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
  <nav className="w-full flex py-6 px-6 justify-between items-center bg-black/40 backdrop-blur-md shadow-md fixed top-0 z-50 font-poppins">

      {/* Logo */}
      <Link to="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
          alt="logo"
          className="w-[124px] h-[32px] object-contain"
        />
      </Link>

      {/* Desktop Menu */}
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.to}
            className={`cursor-pointer text-[16px] font-medium relative transition duration-300 ${
              location.pathname === nav.to ? "text-white" : "text-gray-200"
            } ${index !== navLinks.length - 1 ? "mr-10" : ""}
              ${nav.isButton ? "" : "group"}
            `}
          >
            <Link
              to={nav.to}
              className={`${
                nav.isButton
                  ? "bg-white text-indigo-700 px-4 py-1.5 rounded-md hover:bg-indigo-100 transition"
                  : ""
              }`}
            >
              {nav.title}
            </Link>
            {!nav.isButton && (
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
            )}
          </li>
        ))}
      <ul className="flex space-x-6 text-black text-lg font-medium">
        <li>
          <Link to="/" className="hover:underline">HOME</Link>
        </li>
        <li>
          <Link to="/about" className="hover:underline">ABOUT</Link>
        </li>
        <li>
          <Link to="/events" className="hover:underline">EVENTS</Link>
        </li>
        <li className="border border-black rounded px-2 hover:bg-gray-100 transition">
          <Link className="hover:text-purple-700" to="/auth">LOGIN</Link>
        </li>
        <Link
          to="/dashboard/scan"
            className="ml-4 text-indigo-600 hover:text-indigo-800"
            title="Mark Attendance"
                >
            <QrCode className="w-6 h-6" />
        </Link>

      </ul>

      {/* Mobile Menu Icon */}
      <div className="sm:hidden flex flex-1 justify-end items-center">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-2xl focus:outline-none"
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        {/* Mobile Dropdown */}
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } flex-col bg-white absolute top-20 right-4 p-6 rounded-xl shadow-lg min-w-[160px] z-50`}
        >
          <ul className="flex flex-col space-y-4">
            {navLinks.map((nav) => (
              <li key={nav.to}>
                <Link
                  to={nav.to}
                  onClick={() => setMenuOpen(false)}
                  className={`text-[16px] font-medium transition relative ${
                    nav.isButton
                      ? "bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                      : `${
                          location.pathname === nav.to
                            ? "text-indigo-700 font-semibold"
                            : "text-gray-700"
                        } group`
                  }`}
                >
                  {nav.title}
                  {!nav.isButton && (
                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-700 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
