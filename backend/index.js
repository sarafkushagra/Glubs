require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const http = require("http");

const config = require("./config/app.config");
const socketIO = require("./utils/socket");
const globalErrorHandler = require("./utils/globalErrorHandler");
const AppError = require("./utils/appError");

const app = express();
const server = http.createServer(app);
socketIO.init(server);

// ============ MIDDLEWARE SETUP ============

// Body Parser Middleware
app.use(express.json({ limit: config.api.maxRequestSize }));
app.use(express.urlencoded({ extended: true, limit: config.api.maxRequestSize }));

// CORS Middleware - Use config-based origins
app.use(cors(config.cors));

// Cookie Parser Middleware
app.use(cookieParser());

// ============ DATABASE CONNECTION ============

async function connectDB() {
  try {
    await mongoose.connect(config.database.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

connectDB();

// ============ HEALTH CHECK ============

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    env: config.server.nodeEnv,
  });
});

// ============ ROUTES ============

const userRouter = require("./routers/user");
const eventRouter = require("./routers/event");
const clubRouter = require("./routers/club");
const feedbackRouter = require("./routers/feedback");
const adminRouter = require("./routers/admin");
const teamRouter = require("./routers/team");
const clubAdminRouter = require("./routers/clubAdmin");
const attendanceRouter = require("./routers/attendance");
const paymentRouter = require("./routers/payment");
const notificationRouter = require("./routers/notification");

// API Routes
app.use("/users", userRouter);
app.use("/events", eventRouter);  // Changed from /event to /events for consistency
app.use("/event", eventRouter);   // Keep /event for backwards compatibility
app.use("/clubs", clubRouter);
app.use("/feedback", feedbackRouter);
app.use("/admin", adminRouter);
app.use("/teams", teamRouter);
app.use("/club-admin", clubAdminRouter);
app.use("/attendance", attendanceRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/payments", paymentRouter);

// ============ 404 HANDLER ============

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ============ GLOBAL ERROR HANDLER ============

app.use(globalErrorHandler);

// ============ SERVER STARTUP ============

const PORT = config.server.port;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${config.server.nodeEnv}`);
  if (!config.server.isProduction) {
    console.log(`🔓 CORS enabled for: ${config.cors.origin.join(", ")}`);
  }
});

// ============ UNHANDLED ERRORS ============

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});
