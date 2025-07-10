import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
function Footer() {
  return (
    <footer className="mt-12 bg-gradient-to-b from-[#1e3c72] to-[#2a5298] text-white py-12 w-full">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid md:grid-cols-3 gap-20 text-center md:text-left">
          {/* Column 1 */}
          <div>
            <h1 className="text-2xl font-bold mb-4">GLUBS</h1>
            <p className="mb-4">
              GLUBS is your trusted platform for managing and discovering campus events.
              We empower students and organizers with powerful tools to connect, learn, and grow — one event at a time.
            </p>
            <h3 className="font-semibold mb-2">Connect with Us</h3>
            <div className="flex justify-center md:justify-start space-x-3">
              <a
                href="https://www.facebook.com/glubs"
                className="bg-white text-black flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200"
              >
                <FaFacebook size={32} />
              </a>
              <a
                href="#"
                className="bg-white text-black flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200"
              >
                <FaTwitter size={32} />
              </a>
              <a
                href="#"
                className="bg-white text-black flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200"
              >
                <FaYoutube size={32} />
              </a>
              <a
                href="#"
                className="bg-white text-black flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200"
              >
                <FaInstagram  size={32} />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Team</a></li>
              <li><a href="#" className="hover:underline">FAQ</a></li>
              <li><a href="#" className="hover:underline">Events</a></li>
              <li><a href="#" className="hover:underline">Resources</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">Feedback</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>

        <hr className="my-6 border-blue-300" />
        <div className="flex flex-col md:flex-row justify-between text-sm opacity-80">
          <p>Last Updated: 08 Apr 2025 • Version: 2.98.0.15</p>
          <p>© 2025 GLUBS. Maintained by the Core Dev Team.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
