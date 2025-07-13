import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 border-b text-indigo-700 font-bold text-xl">👤 My Space</div>
      <nav className="flex flex-col p-4 space-y-4 text-gray-700">
        <Link to="/dashboard/profile" onClick={toggleSidebar} className="hover:text-indigo-600">My Profile</Link>
        <Link to="/events" onClick={toggleSidebar} className="hover:text-indigo-600">Discover Events</Link>
        <Link to="/dashboard/notifications" onClick={toggleSidebar} className="hover:text-indigo-600">Notifications</Link>
        <Link to="qr-scan" onClick={toggleSidebar} className="hover:text-indigo-600">QR Attendance</Link>
        <button onClick={toggleSidebar} className="text-left text-red-600 hover:text-red-800">Close</button>
      </nav>
    </aside>
  );
}
