import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-blue-600 shadow">
      <Link to="/">
        <img 
          src="data:image/png;base64,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" 
          alt="Logo" 
          className="w-8 h-8 rounded-full" 
        />
      </Link>

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
      </ul>
    </nav>
  );
}
