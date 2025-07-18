import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { QrCode } from "lucide-react";
import img1 from "../images/Adobe Express - file (1).png";
import { CgProfile } from "react-icons/cg";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  // Sync login state on localStorage change (tab switching)
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUsername(localStorage.getItem("username"));
    };
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/auth");
  };

  const navLinks = [
    { title: "Home", to: "/" },
    { title: "About", to: "/about" },
    { title: "Events", to: "/events" },
    { title: "Clubs", to: "/clubs" },
    { title: "Hosts", to: "/host" },
  ];

  return (
    <nav className="w-full flex py-6 px-6 justify-between items-center bg-black/40 backdrop-blur-md fixed top-0 z-50 font-poppins">
      {/* Logo */}
      <Link to="/">
        <img
          src={img1}
          alt="logo"
          className="w-[124px] h-[36px] object-contain"
        />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex justify-end items-center flex-1 space-x-8">
        {navLinks.map((nav) => (
          <li key={nav.to} className="relative group">
            <Link
              to={nav.to}
              className={`text-[16px] font-medium transition ${
                location.pathname === nav.to
                  ? "text-white"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              {nav.title}
            </Link>
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
          </li>
        ))}

        {isLoggedIn ? (
          <>
            <li className="text-gray-200  text-2xl"><Link to={"/profile"}><CgProfile  /></Link> </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              to="/auth"
              className="bg-white text-indigo-700 px-4 py-1.5 rounded-md hover:bg-indigo-100 transition"
            >
              Get Started
            </Link>
          </li>
        )}

        {/* QR Icon */}
        <li>
          <Link
            to="/qr-scan"
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
                <li className="text-gray-700">Hi, {username}!</li>
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
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/scan"
                onClick={() => setMenuOpen(false)}
                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
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
