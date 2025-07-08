import { User, Home, Calendar, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";

const Header = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <>
      <header className="bg-white shadow-lg border-b-2 border-blue-100 h-[90px] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                  <span className="text-white font-bold text-2xl">G</span>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Glubs
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link 
                to="/" 
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/') ? 'bg-blue-100 text-blue-700 font-semibold shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
              <Link 
                to="/events" 
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/events') ? 'bg-blue-100 text-blue-700 font-semibold shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Events
              </Link>
              <Link 
                to="/clubs" 
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/clubs') ? 'bg-blue-100 text-blue-700 font-semibold shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Clubs
              </Link>
              <Link 
                to="/dashboard" 
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/dashboard') ? 'bg-blue-100 text-blue-700 font-semibold shadow-md' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                Dashboard
              </Link>
            </nav>
            
            {/* Profile Icon */}
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="group relative p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md border-2 border-transparent hover:border-blue-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;