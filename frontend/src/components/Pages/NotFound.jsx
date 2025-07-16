import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-100">
      <h1 className="text-5xl font-bold text-red-600 mb-4">Wrong URL</h1>
      <p className="text-xl text-gray-700 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
      >
        {/* Back to Home Button*/}
        Back to Landing Page
      </Link>
    </div>
  );
}
