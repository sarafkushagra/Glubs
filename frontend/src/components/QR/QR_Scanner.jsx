// import React, { useEffect, useRef, useState } from "react";
// import { Html5QrcodeScanner } from "html5-qrcode";
// import axios from "axios";

// const QRScanner = () => {
//   const [scanResult, setScanResult] = useState(null);
//   const [status, setStatus] = useState("");
//   const scannerRef = useRef(null);

//   useEffect(() => {
//     if (!scannerRef.current) {
//       scannerRef.current = new Html5QrcodeScanner(
//         "qr-reader",
//         { fps: 10, qrbox: { width: 250, height: 250 } },
//         false
//       );

//       scannerRef.current.render(
//         async (decodedText) => {
//           try {
//             const data = JSON.parse(decodedText);
//             const response = await axios.post("/api/verify-entry", {
//               participantId: data.participantId,
//             });

//             if (response.data.success) {
//               setStatus("✅ Access Granted to " + response.data.participant.name);
//             } else {
//               setStatus("❌ Access Denied: " + response.data.message);
//             }
//           } catch (error) {
//             setStatus("❌ Invalid QR Code or Network Error");
//             console.error(error);
//           }

//           setScanResult(decodedText);
//           scannerRef.current.clear();
//         },
//         (error) => {
//           console.warn(error);
//         }
//       );
//     }
//   }, []);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
//       <h1 className="text-3xl font-extrabold text-blue-600 mb-6">
//         QR Code Scanner
//       </h1>

//       {!scanResult ? (
//         <div
//           id="qr-reader"
//           className="w-full max-w-md border-4 border-blue-200 rounded-xl shadow-lg"
//         />
//       ) : (
//         <div className="mt-6 p-4 border border-blue-300 rounded-lg bg-blue-50 text-center shadow">
//           <p className="text-lg text-blue-700 font-semibold mb-2">Status:</p>
//           <p className="text-blue-900 break-words">{status}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QRScanner;


import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

const QRScanner = ({ currentUser }) => {
  const [scanResult, setScanResult] = useState(null);
  const [status, setStatus] = useState("");
  const [details, setDetails] = useState(null);
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
            const response = await axios.post(
              "http://localhost:3000/qr/verify-qr",
              { qrData: decodedText, scannedBy: currentUser._id }
            );

            const { message, user, event, scannedAt } = response.data;

            setStatus(message);
            setDetails({ user, event, scannedAt });
          } catch (error) {
            if (error.response) {
              setStatus("❌ " + error.response.data.message);
            } else {
              setStatus("❌ Invalid QR Code or Network Error");
            }
            setDetails(null);
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
  }, [currentUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
        QR Code Entry Scanner
      </h1>

      {!scanResult ? (
        <div
          id="qr-reader"
          className="w-full max-w-md border-4 border-blue-300 dark:border-blue-700 rounded-xl shadow-lg"
        />
      ) : (
        <div className="mt-6 p-6 border border-blue-300 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-gray-800 text-center shadow">
          <p className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">
            Scan Result:
          </p>
          <p className="text-blue-900 dark:text-blue-100 mb-2">{status}</p>

          {details && (
            <div className="text-sm text-gray-700 dark:text-gray-300 mt-4">
              <p><strong>User:</strong> {details.user}</p>
              <p><strong>Event:</strong> {details.event}</p>
              <p><strong>Time:</strong> {new Date(details.scannedAt).toLocaleString()}</p>
            </div>
          )}

          <button
            onClick={() => {
              setScanResult(null);
              setStatus("");
              setDetails(null);
              scannerRef.current?.clear().then(() => {
                scannerRef.current?.render();
              });
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Scan Another
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
