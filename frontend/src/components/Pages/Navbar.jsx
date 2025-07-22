// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import img1 from "../images/Adobe Express - file (1).png";
// import { CgProfile } from "react-icons/cg";
// import { BiLogIn } from "react-icons/bi";
// import { QrCode } from "lucide-react";

// import { RiLogoutCircleLine } from "react-icons/ri";

// export default function Navbar() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const location = useLocation();
//   const navigate = useNavigate();

//   // Check login status via cookies
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await axios.get("http://localhost:3000/users/me", {
//           withCredentials: true,
//         });
//         setIsLoggedIn(!!res.data.user);
//       } catch {
//         setIsLoggedIn(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   const handleLogout = async () => {
//     try {
//       await axios.post("http://localhost:3000/users/logout", {}, {
//         withCredentials: true,
//       });
//       setIsLoggedIn(false);
//       localStorage.removeItem("glubsUser"); // example
//       localStorage.removeItem("glubsToken"); // if you stored any
//       navigate("/");

//       window.location.reload(); // force UI refresh after logout
//     } catch (err) {
//       console.error("Logout failed", err);
//     }
//   };

//   const linkStyle = "relative text-gray-300 hover:text-white transition-colors duration-300";
//   const activeLinkStyle = "text-cyan-400";

//   return (
//     <nav className="w-full flex py-6 px-6 justify-between items-center bg-black/40 backdrop-blur-md fixed top-0 z-50 font-poppins">
//       <Link to="/">
//         <img src={img1} alt="logo" className="w-[124px] h-[36px] object-contain hover:opacity-80 transition-opacity" />
//       </Link>

//       {/* Desktop Menu - Refreshed with new styles */}
//       <ul className="hidden sm:flex justify-end items-center flex-1 space-x-8">
//         {['Home', 'About', 'Events', 'Clubs'].map((item) => (
//           <li key={item} className={`${linkStyle} group`}>
//             <Link
//               to={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
//               className={location.pathname === `/${item.toLowerCase()}` || (location.pathname === '/' && item === 'Home') ? activeLinkStyle : ''}
//             >
//               {item}
//             </Link>
//             {/* Animated underline effect */}
//             <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300 ease-in-out"></span>
//           </li>
//         ))}

//         {isLoggedIn ? (
//           <>
//             {/* Profile and QR Icons */}
//             <li title="Profile">
//               <Link to="/profile" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"><CgProfile size={24} /></Link>
//             </li>
//             <li title="Mark Attendance">
//               <Link to="/qr-scan" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"><QrCode className="w-6 h-6" /></Link>
//             </li>
//             {/* Logout Button */}
//             <li title="Logout">
//               <button
//                 onClick={handleLogout}
//                 className="text-gray-300 hover:text-red-500 transition-colors duration-300"
//               >
//                 <RiLogoutCircleLine className="w-6 h-6" />
//               </button>
//             </li>
//           </>
//         ) : (
//           // Login Button
//           <li title="Login">
//             <Link to="/auth" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
//               <BiLogIn className="w-6 h-6" />
//             </Link>
//           </li>
//         )}
//       </ul>

//       {/* Mobile Hamburger */}
//       {/* <div className="sm:hidden flex items-center">
//         <button
//           onClick={() => setMenuOpen(!menuOpen)}
//           className="text-white text-2xl focus:outline-none"
//         >
//           {menuOpen ? "✖" : "☰"}
//         </button>
//       </div> */}

//       {/* Mobile Dropdown */}
//       {/* {menuOpen && (
//         <div className="sm:hidden absolute top-20 right-4 bg-white p-6 rounded-xl shadow-lg min-w-[180px] z-50">
//           <ul className="flex flex-col space-y-4">
//             {navLinks.map((nav) => (
//               <li key={nav.to}>
//                 <Link
//                   to={nav.to}
//                   onClick={() => setMenuOpen(false)}
//                   className={`text-[16px] font-medium ${
//                     location.pathname === nav.to
//                       ? "text-indigo-700 font-semibold"
//                       : "text-gray-700 hover:text-indigo-700"
//                   }`}
//                 >
//                   {nav.title}
//                 </Link>
//               </li>
//             ))}
//             {isLoggedIn ? (
//               <>
//                 <li>
//                   <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-700 hover:text-indigo-700">
//                     <CgProfile className="w-5 h-5" /> Profile
//                   </Link>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setMenuOpen(false);
//                     }}
//                     className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full text-left"
//                   >
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <li>
//                 <Link
//                   to="/auth"
//                   onClick={() => setMenuOpen(false)}
//                   className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-center"
//                 >
//                   Login
//                 </Link>
//               </li>
//             )}
//           </ul>
//         </div>
//       )} */}
//     </nav>
//   );
// }


"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import img1 from "../images/Adobe Express - file (1).png"
import { CgProfile } from "react-icons/cg"
import { BiLogIn } from "react-icons/bi"
import { QrCode, Bell } from "lucide-react"
import { RiLogoutCircleLine } from "react-icons/ri"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [notificationCount, setNotificationCount] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  // Check login status via cookies
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:3000/users/me", {
          withCredentials: true,
        })
        setIsLoggedIn(!!res.data.user)
        setUser(res.data.user)

        // If logged in, fetch notification count
        if (res.data.user) {
          fetchNotificationCount()
        }
      } catch {
        setIsLoggedIn(false)
        setUser(null)
      }
    }
    checkAuth()
  }, [location.pathname]) // Re-check when path changes

  // Fetch notification count
  const fetchNotificationCount = async () => {
    try {
      // Fetch all events
      const eventsRes = await axios.get("http://localhost:3000/event", { withCredentials: true })
      const events = eventsRes.data

      // Count pending requests across all events
      let totalCount = 0

      for (const event of events) {
        try {
          const requestsRes = await axios.get(`http://localhost:3000/teams/requests/${event._id}`, {
            withCredentials: true,
          })

          // Only count pending requests
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
    const userData = localStorage.getItem("glubsUser");
    if (userData) {
      const role = JSON.parse(userData).role;
      if (role === "student") return "/profile";
      if (role === "admin" || role === "clubadmin") return "/clubadmin/dash";
    }
    console.log(userData);
    return "/home";
  };


  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/users/logout",
        {},
        {
          withCredentials: true,
        },
      )
      setIsLoggedIn(false)
      setUser(null)
      localStorage.removeItem("glubsUser")
      localStorage.removeItem("glubsToken")
      navigate("/")
      window.location.reload() // force UI refresh after logout
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  const linkStyle = "relative text-gray-300 hover:text-white transition-colors duration-300"
  const activeLinkStyle = "text-cyan-400"

  return (
    <nav className="w-full flex py-6 px-6 justify-between items-center bg-black/40 backdrop-blur-md fixed top-0 z-50 font-poppins">
      <Link to="/">
        <img
          src={img1 || "/placeholder.svg"}
          alt="logo"
          className="w-[124px] h-[36px] object-contain hover:opacity-80 transition-opacity"
        />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex justify-end items-center flex-1 space-x-8">
        {["Home", "About", "Events", "Clubs"].map((item) => (
          <li key={item} className={`${linkStyle} group`}>
            <Link
              to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
              className={
                location.pathname === `/${item.toLowerCase()}` || (location.pathname === "/" && item === "Home")
                  ? activeLinkStyle
                  : ""
              }
            >
              {item}
            </Link>
            {/* Animated underline effect */}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300 ease-in-out"></span>
          </li>
        ))}

        {isLoggedIn ? (
          <>
            {isLoggedIn && (
              <>

                {/* Notification Icon */}
                <li title="Notifications">
                  <Link
                    to="/notifications"
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 relative"
                  >
                    <Bell className="w-6 h-6" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    )}
                  </Link>
                </li>




                <li title="Profile">
                  <Link
                    to={getProfileLink()}
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-300"
                  >
                    <CgProfile size={24} />
                  </Link>

                </li>
                <li title="Mark Attendance">
                  <Link to="/qr-scan" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                    <QrCode className="w-6 h-6" />
                  </Link>
                </li>
              </>
            )}

            <li title="Logout">
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-red-500 transition-colors duration-300"
              >
                <RiLogoutCircleLine className="w-6 h-6" />
              </button>
            </li>
          </>
        ) : (
          // Login Button
          <li title="Login">
            <Link to="/auth" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
              <BiLogIn className="w-6 h-6" />
            </Link>
          </li>
        )}
      </ul>

      {/* Mobile Hamburger */}
      <div className="sm:hidden flex items-center">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white text-2xl focus:outline-none">
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="sm:hidden absolute top-20 right-4 bg-gray-900/90 backdrop-blur-md p-6 rounded-xl shadow-lg min-w-[180px] z-50 border border-gray-700/50">
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
                <li>
                  <Link
                    to="/qr-scan"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-gray-300 hover:text-white"
                  >
                    <QrCode className="w-5 h-5" /> QR Scan
                  </Link>
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
    </nav>
  )
}
