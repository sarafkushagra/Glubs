import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [status, setStatus] = useState("");
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scannerRef.current.render(
        async (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            const response = await axios.post("/api/verify-entry", {
              participantId: data.participantId,
            });

            if (response.data.success) {
              setStatus("✅ Access Granted to " + response.data.participant.name);
            } else {
              setStatus("❌ Access Denied: " + response.data.message);
            }
          } catch (error) {
            setStatus("❌ Invalid QR Code or Network Error");
            console.error(error);
          }

          setScanResult(decodedText);
          scannerRef.current.clear();
        },
        (error) => {
          console.warn(error);
        }
      );
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-3xl font-extrabold text-blue-600 mb-6">
        QR Code Scanner
      </h1>

      {!scanResult ? (
        <div
          id="qr-reader"
          className="w-full max-w-md border-4 border-blue-200 rounded-xl shadow-lg"
        />
      ) : (
        <div className="mt-6 p-4 border border-blue-300 rounded-lg bg-blue-50 text-center shadow">
          <p className="text-lg text-blue-700 font-semibold mb-2">Status:</p>
          <p className="text-blue-900 break-words">{status}</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
