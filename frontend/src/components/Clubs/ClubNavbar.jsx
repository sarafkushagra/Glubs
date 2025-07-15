import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import img1 from "../images/Adobe Express - file (1).png"

export default function ClubNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { title: "Home", to: "/" },
        { title: "Events", to: "/events" },
        { title: "Clubs", to: "/clubs" },
        { title: "Hosts", to: "/host" },
        { title: "Add Club", to: "/clubs/add" , isButton: true }
    ];

    return (
        <nav className="w-full flex py-6 px-6 justify-between items-center bg-[#200c40] backdrop-blur-md fixed top-0 z-50 font-poppins">
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
                            className={`text-[16px] font-medium transition ${nav.isButton
                                    ? "bg-white text-indigo-700 px-4 py-1.5 rounded-md hover:bg-indigo-100"
                                    : location.pathname === nav.to
                                        ? "text-white"
                                        : "text-gray-200 hover:text-white"
                                }`}
                        >
                            {nav.title}
                        </Link>
                        {!nav.isButton && (
                            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300 ease-in-out"></span>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
}
