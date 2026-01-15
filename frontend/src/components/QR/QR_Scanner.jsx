import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [status, setStatus] = useState("");
  const [attendeeInfo, setAttendeeInfo] = useState(null);
  const scannerRef = useRef(null);

  const startScanner = () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scannerRef.current.render(
        async (decodedText) => {
          try {
            setStatus("Verifying...");
            const response = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/attendance/verify`,
              { qrToken: decodedText },
              { withCredentials: true }
            );

            if (response.data.valid) {
              setAttendeeInfo(response.data.attendance);
              setStatus(response.data.alreadyVerified ? "⚠️ Already Verified" : "✅ Access Granted");
            } else {
              setStatus("❌ Access Denied: " + response.data.message);
            }
          } catch (error) {
            setStatus("❌ " + (error.response?.data?.message || "Invalid QR Code or Network Error"));
            console.error(error);
          }

          setScanResult(decodedText);
          if (scannerRef.current) {
            scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
          }
        },
        (error) => {
          // Warning callback
        }
      );
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Cleanup error", err));
        scannerRef.current = null;
      }
    };
  }, []);

  const handleReset = () => {
    setScanResult(null);
    setStatus("");
    setAttendeeInfo(null);
    // Give DOM a moment to re-render the div
    setTimeout(() => {
      startScanner();
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 pt-24 font-dm-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Event Check-in
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Scan QR code for attendance verification
        </p>

        {!scanResult ? (
          <div
            id="qr-reader"
            className="w-full overflow-hidden rounded-2xl border-2 border-dashed border-gray-200"
          />
        ) : (
          <div className="space-y-6">
            <div className={`p-4 rounded-2xl text-center font-bold ${status.includes("✅") ? "bg-green-50 text-green-700 border border-green-200" :
                status.includes("⚠️") ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                  "bg-red-50 text-red-700 border border-red-200"
              }`}>
              {status}
            </div>

            {attendeeInfo && (
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">Attendee</span>
                  <span className="font-bold text-gray-800">{attendeeInfo.user.username}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500 text-sm">Event</span>
                  <span className="font-bold text-gray-800">{attendeeInfo.event.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Time</span>
                  <span className="font-medium text-gray-600">
                    {new Date(attendeeInfo.verifiedAt || attendeeInfo.registeredAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              Scan Next Person
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
