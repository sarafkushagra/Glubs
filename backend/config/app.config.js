/**
 * Backend Configuration
 * Centralized configuration for server setup
 */

module.exports = {
  // Server Configuration
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV !== 'production',
    isProduction: process.env.NODE_ENV === 'production',
  },

  // Database Configuration
  database: {
    mongoUrl: process.env.MONGO_URL,
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    cookieExpiresIn: process.env.JWT_COOKIE_EXPIRES_IN || 7,
  },

  // CORS Configuration
  cors: {
    origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(','),
    credentials: true,
    optionsSuccessStatus: 200,
  },

  // Email Configuration
  email: {
    provider: process.env.EMAIL_PROVIDER || 'resend',
    apiKey: process.env.RESEND_API_KEY,
  },

  // Payment Configuration
  payment: {
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID,
      keySecret: process.env.RAZORPAY_KEY_SECRET,
    },
  },

  // Socket.io Configuration
  socket: {
    cors: {
      origin: (process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173').split(','),
      credentials: true,
    },
  },

  // API Configuration
  api: {
    maxRequestSize: '20mb',
    requestTimeout: 30000,
    retryAttempts: 3,
  },

  // Feature Flags
  features: {
    sendEmails: !process.env.DISABLE_EMAILS,
    allowRegistration: !process.env.DISABLE_REGISTRATION,
    requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION !== 'false',
  },

  // Security
  security: {
    bcryptRounds: 10,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
};
