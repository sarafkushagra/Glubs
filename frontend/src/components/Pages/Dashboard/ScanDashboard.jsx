import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const ScanDashboard = () => {
  const qrData = 'GLUBS-USER123';
  const [scanned, setScanned] = useState('');

  const handleScan = () => {
    setScanned(qrData); // In real app, this would come from a QR scanner
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 text-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">QR Check-In Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Scan participant QR codes to mark attendance instantly.
      </p>

      <div className="flex flex-col items-center space-y-6">
        <QRCode value={qrData} size={150} />
        <button
          onClick={handleScan}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Simulate Scan
        </button>
        {scanned && (
          <div className="bg-green-100 text-green-700 px-6 py-3 rounded shadow-md mt-4">
            ✅ Scanned Successfully: <strong>{scanned}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanDashboard;
