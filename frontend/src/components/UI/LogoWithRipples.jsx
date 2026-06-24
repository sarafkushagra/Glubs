import React from 'react';
import logo from '../images/Adobe Express - file (1).png'; 

export default function LogoWithRipples() {
  return (
    <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
      {/* Ripple Circles */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-300 opacity-20 animate-ping"></div>
      <div className="absolute w-60 h-60 sm:w-80 sm:h-80 rounded-full bg-blue-400 opacity-30 animate-ping delay-200"></div>
      <div className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-blue-500 opacity-40 animate-ping delay-500"></div>
      <div className="absolute w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-blue-600 opacity-50 animate-ping delay-700"></div>

      {/* Logo */}
      <div className="z-10 w-80 h-80 sm:w-80 sm:h-80 rounded-full flex items-center justify-center transform translate-x-[10px] -translate-y-[10px]">
        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
      </div>
    </div>
  );
}
