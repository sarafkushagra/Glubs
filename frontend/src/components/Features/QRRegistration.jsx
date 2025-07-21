// QRRegistration.jsx
import React from 'react';

export default function QRRegistration() {
  return (
    <div className="w-full min-h-screen bg-[#0f0c29] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-center mb-6 tracking-wide">
          QR Check-In System
        </h1>

        {/* Subheading */}
        <p className="text-center text-lg text-gray-300 mb-14 max-w-2xl mx-auto">
          Experience the future of event registrations — secure, instant, and paperless with our advanced QR code system. Tailored for campuses & tech events.
        </p>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* Box 1 */}
          <div className="bg-[#1e1b3a] hover:bg-[#2d295c] p-6 rounded-2xl shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold text-purple-400 mb-3">🎟️ Instant QR Generation</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Get a unique QR code immediately after registration. <br />
              No waiting, no paperwork, 100% automated.
            </p>
          </div>

          {/* Box 2 */}
          <div className="bg-[#1e1b3a] hover:bg-[#2d295c] p-6 rounded-2xl shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold text-blue-400 mb-3">📲 Mobile-Friendly Scanning</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Organizers scan your code using their dashboard or scanner tool. <br />
              Works smoothly on mobile & tablet.
            </p>
          </div>

          {/* Box 3 */}
          <div className="bg-[#1e1b3a] hover:bg-[#2d295c] p-6 rounded-2xl shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold text-pink-400 mb-3">✅ One-Tap Attendance</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Attendance marked automatically as you enter. <br />
              No manual errors, fully secure system.
            </p>
          </div>

          {/* Box 4 */}
          <div className="bg-[#1e1b3a] hover:bg-[#2d295c] p-6 rounded-2xl shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold text-yellow-400 mb-3">📅 Attendance History</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Students & admins can see full attendance logs. <br />
              Useful for insights, data export, and analysis.
            </p>
          </div>

          {/* Box 5 */}
          <div className="bg-[#1e1b3a] hover:bg-[#2d295c] p-6 rounded-2xl shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold text-teal-400 mb-3">🛡️ Secure & Unique</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Each QR is encoded and tamper-proof. <br />
              Prevents misuse, fake entries, and duplicates.
            </p>
          </div>

          {/* Box 6 */}
          <div className="bg-[#1e1b3a] hover:bg-[#2d295c] p-6 rounded-2xl shadow-xl transition duration-300">
            <h2 className="text-xl font-semibold text-green-400 mb-3">🔄 Real-time Updates</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Dashboard reflects scanned entries live. <br />
              Organizers stay in sync with check-ins as they happen.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-indigo-600 hover:to-purple-600 text-white px-10 py-3 rounded-full text-lg font-bold shadow-xl transition duration-300">
            Explore Admin Tools
          </button>
        </div>
      </div>
    </div>
  );
}
