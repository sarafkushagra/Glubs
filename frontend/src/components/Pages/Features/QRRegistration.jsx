// QRRegistration.jsx
import React from 'react';

export default function QRRegistration() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">QR Registration</h1>
      <p className="text-gray-700 text-lg mb-4">
        Our QR-based check-in system ensures fast and contactless entry to all events. Each participant receives a unique QR code upon registration, which is scanned at the entrance using our admin app or dashboard scanner.
      </p>
      <ul className="text-left list-disc list-inside text-gray-600 space-y-2">
        <li>Generate QR on successful registration</li>
        <li>Scan at event entrance with QR scanner tool</li>
        <li>Mark attendance instantly</li>
        <li>View attendance history in your dashboard</li>
      </ul>
    </div>
  );
}
