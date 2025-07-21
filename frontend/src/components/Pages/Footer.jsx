import React from "react";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa"; // Using sleeker icons

function Footer() {
  const socialLinks = [
    { icon: <FaFacebookF />, href: "https://www.facebook.com/glubs" },
    { icon: <FaTwitter />, href: "https://www.twitter.com/glubs" },
    { icon: <FaYoutube />, href: "https://www.youtube.com/glubs" },
    { icon: <FaInstagram />, href: "https://www.instagram.com/glubs" },
  ];

  const quickLinks = ["About Us", "Team", "FAQ", "Events", "Resources"];
  const supportLinks = ["Help Center", "Feedback", "Careers", "Privacy Policy", "Terms & Conditions"];

  return (
    <footer className="bg-gradient-to-t from-[#0d1117] to-[#161b22] text-gray-400 py-12 w-full border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          
          {/* Column 1: About & Socials */}
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold text-white mb-4">GLUBS</h1>
            <p className="mb-6 text-gray-500">
              Your trusted platform for managing and discovering campus events. We empower students and organizers with powerful tools to connect, learn, and grow.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center
                    bg-gray-800/50 border border-gray-700 text-gray-400
                    hover:text-cyan-400 hover:border-cyan-400 hover:scale-110 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}><a href="#" className="hover:text-cyan-400 hover:underline transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="font-semibold text-white mb-5">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}><a href="#" className="hover:text-cyan-400 hover:underline transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700/50 flex flex-col md:flex-row justify-between text-sm text-gray-600 text-center">
          <p className="font-mono">© {new Date().getFullYear()} GLUBS. Maintained by the Core Dev Team.</p>
          <p className="font-mono mt-2 md:mt-0">Version: 1.0.0 </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;