"use client"

import React, { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import img1 from "../images/Adobe Express - file (1).png"
import { CgProfile } from "react-icons/cg"
import { BiLogIn } from "react-icons/bi"
import { QrCode, Bell, Moon, Sun, Menu, X } from "lucide-react"
import { RiLogoutCircleLine } from "react-icons/ri"
import { useTheme } from "../Context/ThemeContext"

// Uses DM Sans Thin for a modern, thin navbar font
const Navbar = React.memo(function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [notificationCount, setNotificationCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Check login status via cookies
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("glubsToken");
      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
          withCredentials: true,
        })
        setIsLoggedIn(!!res.data.user)
        setUser(res.data.user)
        if (res.data.user) {
          fetchNotificationCount()
        }
      } catch {
        setIsLoggedIn(false)
        setUser(null)
      }
    }
    checkAuth()
  }, [location.pathname])

  // Fetch notification count
  const fetchNotificationCount = async () => {
    try {
      const eventsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/event`, { withCredentials: true })
      const events = eventsRes.data

      let totalCount = 0
      for (const event of events) {
        try {
          const requestsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/teams/requests/${event._id}`, {
            withCredentials: true,
          })
          const pendingRequests = requestsRes.data.requests.filter((req) => req.status === "pending")
          totalCount += pendingRequests.length
        } catch (err) {
          // Ignore errors for events with no requests
        }
      }
      setNotificationCount(totalCount)
    } catch (err) {
      console.error("Error fetching notifications:", err)
    }
  }

  const getProfileLink = () => {
    const userData = localStorage.getItem("glubsUser")
    if (userData) {
      const role = JSON.parse(userData).role
      console.log("User role:", role)
      if (role === "student" || role === "club-admin") return "/profile"
      if (role === "admin") return "/clubadmin/dash"
    }
    return "/"
  }

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/logout`, {}, { withCredentials: true });
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem("glubsUser");
      localStorage.removeItem("glubsToken");
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };


  // Enhanced navbar styling with better overlay effect
  const navbarBg = scrolled
    ? theme === "dark"
      ? "bg-gray-900/95 backdrop-blur-2xl border-gray-700/40 shadow-2xl shadow-black/30"
      : "bg-white/95 backdrop-blur-2xl border-gray-200/40 shadow-2xl shadow-black/10"
    : theme === "dark"
      ? "bg-gray-900/80 backdrop-blur-xl border-gray-800/30"
      : "bg-white/80 backdrop-blur-xl border-gray-200/30"

  const navItems = ["Home", "About", "Events", "Clubs"]

  return (
    <>
      {/* Main Navbar - Overlay Style */}
      <nav
        className={`max-w-5xl mx-auto mt-3 w-[97%] flex items-center px-3 lg:px-4 fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out border-b border-none rounded-xl shadow-lg bg-white/80 backdrop-blur-xl font-dm-sans ${scrolled ? "py-1.5" : "py-2"}`}
        style={{
          top: 0,
          boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.13)", // Softer, smaller shadow
          borderRadius: "16px",
          background: theme === "dark"
            ? "rgba(24, 24, 27, 0.85)"
            : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          fontFamily: "'DM Sans', Arial, sans-serif",
          fontWeight: 400,
        }}
      >
        {/* Logo Section with Company Name */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <Link to="/" className="group relative flex items-center gap-3">
            <div className="relative overflow-hidden rounded-xl p-2 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-cyan-500/10 group-hover:to-blue-500/10">
              <img
                src={img1 || "/placeholder.svg"}
                alt="logo"
                className="w-8 h-8 object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            </div>
            <div
              className={`font-bold text-2xl tracking-tight transition-all duration-300 ${theme === "dark" ? "text-white group-hover:text-cyan-400" : "text-gray-900 group-hover:text-cyan-600"
                }`}
            >
              GLUBS
            </div>
          </Link>
        </div>

        {/* Desktop Navigation - Absolutely Centered */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center space-x-4">
            {navItems.map((item, index) => {
              const isActive =
                location.pathname === `/${item.toLowerCase()}` || (location.pathname === "/" && item === "Home")
              return (
                <Link
                  key={item}
                  to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                  className={`relative px-4 py-2 text-base tracking-wide transition-all duration-300 group font-normal` +
                    (isActive
                      ? theme === "dark"
                        ? " text-cyan-400"
                        : " text-cyan-600"
                      : theme === "dark"
                        ? " text-gray-300 hover:text-white"
                        : " text-gray-700 hover:text-gray-900"
                    )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    fontFamily: "'DM Sans', Arial, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  <span className="relative z-10">{item}</span>

                  {/* Bottom border effect */}
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ease-out ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Desktop Actions - Keep Enhanced Right Side */}
        <div className="hidden lg:flex items-center space-x-2 ml-auto">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${theme === "dark"
              ? "bg-gradient-to-r from-yellow-900/20 to-orange-900/20 hover:from-yellow-800/30 hover:to-orange-800/30 text-yellow-400 hover:text-yellow-300 border border-yellow-500/20 hover:border-yellow-400/40"
              : "bg-gradient-to-r from-blue-100/50 to-purple-100/50 hover:from-blue-200/50 hover:to-purple-200/50 text-blue-600 hover:text-purple-600 border border-blue-200/50 hover:border-purple-300/50"
              } hover:scale-110 hover:shadow-lg hover:shadow-yellow-500/20`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 transition-all duration-300 group-hover:rotate-180 group-hover:scale-110" />
            ) : (
              <Moon className="w-5 h-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          </button>

          {isLoggedIn ? (
            <>
              {/* Notifications */}
              <Link
                to="/notifications"
                className={`relative p-3 rounded-2xl transition-all duration-300 group overflow-hidden ${theme === "dark"
                  ? "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-cyan-400 border border-gray-700/50 hover:border-cyan-500/30"
                  : "bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-cyan-600 border border-gray-200/50 hover:border-cyan-300/50"
                  } hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20`}
                title="Notifications"
              >
                <Bell className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                {notificationCount > 0 && (
                  <span className="mt-2 mr-2 absolute -top-1 -right-1 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-bounce border-2 border-white dark:border-gray-900">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </Link>

              {/* Profile */}
              <Link
                to={getProfileLink()}
                className={`p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${theme === "dark"
                  ? "bg-gradient-to-r from-cyan-900/30 to-blue-900/30 hover:from-cyan-800/40 hover:to-blue-800/40 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50"
                  : "bg-gradient-to-r from-cyan-100/50 to-blue-100/50 hover:from-cyan-200/50 hover:to-blue-200/50 text-cyan-600 hover:text-blue-600 border border-cyan-200/50 hover:border-blue-300/50"
                  } hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20`}
                title="Profile"
              >
                <CgProfile className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </Link>

              {/* QR Scan */}
              {
                user?.role !== "student" &&

                <Link
                  to="/qr-scan"
                  className={`p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${theme === "dark"
                    ? "bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-green-400 border border-gray-700/50 hover:border-green-500/30"
                    : "bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 hover:text-green-600 border border-gray-200/50 hover:border-green-300/50"
                    } hover:scale-110 hover:shadow-lg hover:shadow-green-500/20`}
                  title="QR Scan"
                >
                  <QrCode className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                </Link>
              }

              {/* Logout */}
              <button
                onClick={handleLogout}
                className={`p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${theme === "dark"
                  ? "bg-gradient-to-r from-red-900/30 to-pink-900/30 hover:from-red-800/40 hover:to-pink-800/40 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50"
                  : "bg-gradient-to-r from-red-100/50 to-pink-100/50 hover:from-red-200/50 hover:to-pink-200/50 text-red-600 hover:text-red-700 border border-red-200/50 hover:border-red-300/50"
                  } hover:scale-110 hover:shadow-lg hover:shadow-red-500/20`}
                title="Logout"
              >
                <RiLogoutCircleLine className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 group relative overflow-hidden ${theme === "dark"
                ? "bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40"
                : "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
                } hover:scale-105 border border-white/20`}
              title="Login"
            >
              <span className="relative z-10 flex items-center gap-2">
                <BiLogIn className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                Login
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Button - Moved to Right */}
        <div className="lg:hidden flex items-center ml-auto">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 rounded-lg transition-all duration-300 ${theme === "dark"
              ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
              } hover:scale-105 active:scale-95`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden fixed top-20 right-4 bg-gray-900/90 backdrop-blur-md p-6 rounded-xl shadow-lg min-w-[180px] z-[10000] border border-gray-700/50">
          <ul className="flex flex-col space-y-4">
            {["Home", "About", "Events", "Clubs"].map((item) => (
              <li key={item}>
                <Link
                  to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className={`text-[16px] font-medium ${location.pathname === `/${item.toLowerCase()}` || (location.pathname === "/" && item === "Home")
                    ? "text-cyan-400 font-semibold"
                    : "text-gray-300 hover:text-white"
                    }`}
                >
                  {item}
                </Link>
              </li>
            ))}
            {/* Mobile Theme Toggle */}
            <li>
              <button
                onClick={() => {
                  toggleTheme()
                  setMenuOpen(false)
                }}
                className="flex items-center gap-2 text-gray-300 hover:text-white w-full text-left"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    to="/notifications"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white"
                  >
                    <Bell className="w-5 h-5" />
                    Notifications
                    {notificationCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white"
                  >
                    <CgProfile className="w-5 h-5" /> Profile
                  </Link>
                </li>
                <li>{
                  user?.role !== "student" &&
                  <Link
                    to="/qr-scan"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white"
                  >
                    <QrCode className="w-5 h-5" /> QR Scan
                  </Link>
                }

                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMenuOpen(false)
                    }}
                    className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-md hover:bg-red-500/30 w-full text-left flex items-center gap-2"
                  >
                    <RiLogoutCircleLine className="w-5 h-5" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-md hover:bg-cyan-600/30 flex items-center gap-2"
                >
                  <BiLogIn className="w-5 h-5" /> Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  )
})

export default Navbar
