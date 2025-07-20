import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import img1 from "../images/Adobe Express - file (1).png";
import { CgProfile } from "react-icons/cg";
import { BiLogIn } from "react-icons/bi";
import { QrCode } from "lucide-react";

import { RiLogoutCircleLine } from "react-icons/ri";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Check login status via cookies
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:3000/users/me", {
          withCredentials: true,
        });
        setIsLoggedIn(!!res.data.user);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/users/logout", {}, {
        withCredentials: true,
      });
      setIsLoggedIn(false);
      navigate("/auth");
      window.location.reload(); // force UI refresh after logout
    } catch (err) {
      console.error("Logout failed", err);
    }
  };



  return (
    <nav className="w-full flex py-6 px-6 justify-between items-center bg-black/40 backdrop-blur-md fixed top-0 z-50 font-poppins">
      {/* Logo */}
      <Link to="/">
        <img src={img1} alt="logo" className="w-[124px] h-[36px] object-contain" />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex justify-end items-center flex-1 space-x-8">
        {/* Home */}
        <li className="relative group">
          <Link
            to="/"
            className={`text-[16px] font-medium transition ${location.pathname === "/" ? "text-white" : "text-gray-200 hover:text-white"
              }`}
          >
            Home
          </Link>
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
        </li>

        {/* About */}
        <li className="relative group">
          <Link
            to="/about"
            className={`text-[16px] font-medium transition ${location.pathname === "/about" ? "text-white" : "text-gray-200 hover:text-white"
              }`}
          >
            About
          </Link>
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
        </li>

        {/* Events */}
        <li className="relative group">
          <Link
            to="/events"
            className={`text-[16px] font-medium transition ${location.pathname === "/events" ? "text-white" : "text-gray-200 hover:text-white"
              }`}
          >
            Events
          </Link>
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
        </li>

        {/* Clubs */}
        <li className="relative group">
          <Link
            to="/clubs"
            className={`text-[16px] font-medium transition ${location.pathname === "/clubs" ? "text-white" : "text-gray-200 hover:text-white"
              }`}
          >
            Clubs
          </Link>
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
        </li>

        {/* Hosts - only show if logged in */}
          <li className="relative group">
            <Link
              to="/host"
              className={`text-[16px] font-medium transition ${location.pathname === "/host" ? "text-white" : "text-gray-200 hover:text-white"
                }`}
            >
              Hosts
            </Link>
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
          </li>
        

        {isLoggedIn && (
          <>
            <li className="text-gray-200 text-2xl"><Link to={"/profile"}><CgProfile size={24} /></Link></li>
            <li>
              <Link
                to="/qr-scan"
                title="Mark Attendance"
                className="text-indigo-400 hover:text-indigo-600 transition"
              >
                <QrCode className="w-6 h-6" />
              </Link>
            </li>
          </>)}



        {isLoggedIn ? (
          <>
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-1 py-1.5 rounded-md hover:bg-red-600 transition"
              >
                <RiLogoutCircleLine className="w-6 h-6" />
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/auth" className="text-indigo-400 hover:text-indigo-600 transition">
              <BiLogIn className="w-6 h-6" />
            </Link>
          </li>
        )}
      </ul>

      {/* Mobile Hamburger */}
      {/* <div className="sm:hidden flex items-center">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-2xl focus:outline-none"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </div> */}

      {/* Mobile Dropdown */}
      {/* {menuOpen && (
        <div className="sm:hidden absolute top-20 right-4 bg-white p-6 rounded-xl shadow-lg min-w-[180px] z-50">
          <ul className="flex flex-col space-y-4">
            {navLinks.map((nav) => (
              <li key={nav.to}>
                <Link
                  to={nav.to}
                  onClick={() => setMenuOpen(false)}
                  className={`text-[16px] font-medium ${
                    location.pathname === nav.to
                      ? "text-indigo-700 font-semibold"
                      : "text-gray-700 hover:text-indigo-700"
                  }`}
                >
                  {nav.title}
                </Link>
              </li>
            ))}
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-700 hover:text-indigo-700">
                    <CgProfile className="w-5 h-5" /> Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-center"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )} */}
    </nav>
  );
}
