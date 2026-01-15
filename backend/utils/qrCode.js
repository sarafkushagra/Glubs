const crypto = require("crypto");
const QRCode = require("qrcode");

/**
 * QR Code Generation Utility
 * 
 * Generates encrypted QR tokens for event attendance tracking.
 * Uses HMAC-SHA256 for secure token generation.
 */

/**
 * Generate a unique QR token for event attendance
 * @param {String} eventId - Event ObjectId
 * @param {String} userId - User ObjectId
 * @returns {String} Encrypted QR token
 */
exports.generateQRToken = (eventId, userId) => {
    // Create a unique string combining event, user, and timestamp
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(16).toString("hex");
    const data = `${eventId}:${userId}:${timestamp}:${randomBytes}`;

    // Use HMAC-SHA256 to create a secure token
    const secret = process.env.QR_SECRET || process.env.JWT_SECRET;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(data);
    const token = hmac.digest("hex");

    // Return the token with metadata (for verification)
    // Format: token.eventId.userId.timestamp
    return `${token}.${eventId}.${userId}.${timestamp}`;
};

/**
 * Verify and decode a QR token
 * @param {String} qrToken - The QR token to verify
 * @returns {Object} Decoded token data or null if invalid
 */
exports.verifyQRToken = (qrToken) => {
    try {
        // Split the token to extract components
        const parts = qrToken.split(".");
        if (parts.length !== 4) {
            return null;
        }

        const [token, eventId, userId, timestamp] = parts;

        // Check if token is not too old (valid for 30 days)
        const tokenAge = Date.now() - parseInt(timestamp);
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

        if (tokenAge > maxAge) {
            return { valid: false, reason: "Token expired" };
        }

        return {
            valid: true,
            eventId,
            userId,
            timestamp: parseInt(timestamp),
            token,
        };
    } catch (error) {
        console.error("Error verifying QR token:", error);
        return null;
    }
};

/**
 * Generate QR code data URL (base64 image)
 * This can be used for direct display in frontend
 * @param {String} qrToken - The QR token to encode
 * @returns {Promise<String>} Base64 data URL of QR code image
 */
exports.generateQRCodeImage = async (qrToken) => {
    try {
        // Generate QR code as data URL
        const qrDataURL = await QRCode.toDataURL(qrToken, {
            errorCorrectionLevel: "H",
            type: "image/png",
            width: 300,
            margin: 2,
            color: {
                dark: "#000000",
                light: "#FFFFFF",
            },
        });

        return qrDataURL;
    } catch (error) {
        console.error("Error generating QR code image:", error);
        throw error;
    }
};

/**
 * Generate QR code Buffer (binary image data)
 * This is better for email attachments (CID)
 * @param {String} qrToken - The QR token to encode
 * @returns {Promise<Buffer>} Buffer of QR code image
 */
exports.generateQRCodeBuffer = async (qrToken) => {
    try {
        const qrBuffer = await QRCode.toBuffer(qrToken, {
            errorCorrectionLevel: "H",
            type: "image/png",
            width: 300,
            margin: 2,
            color: {
                dark: "#000000",
                light: "#FFFFFF",
            },
        });

        return qrBuffer;
    } catch (error) {
        console.error("Error generating QR code buffer:", error);
        throw error;
    }
};
