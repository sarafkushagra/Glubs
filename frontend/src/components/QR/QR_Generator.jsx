import React from "react";
import QRCode from "react-qr-code";

const QRCodeGenerator = ({ eventId, participantId }) => {
  // Default values for eventId and participantId if not provided
  // This is useful for testing or if you want to generate a QR code without passing props
  eventId = eventId || "685fbd3981eb14dac9db810a";
  participantId = participantId || "685fbd3581eb14dac9db8058";
  const value = JSON.stringify({ eventId, participantId });
  if (!value || value.trim() === "") {
    return <p>No data provided.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <QRCode value={value} size={256} />
      <p className="mt-4 text-center text-sm text-gray-700 break-words max-w-xs">
        Show this QR code at the entry for verification.
      </p>
    </div>
  );
};

export default QRCodeGenerator;
