require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();

app.use(express.json({ limit: "20mb" }))
app.use(express.urlencoded({ extended: true, limit: "20mb" }))

// Middleware
app.use(cors({ origin: ["http://localhost:5173","https://glubs.vercel.app"], credentials: true }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB Connection
const dburl = process.env.MONGO_URL;
async function connectDB() {
    try {
        await mongoose.connect(dburl);
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
}
connectDB();

// Health Check Route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP", message: "Server is healthy." });
});

// Routers
const userRouter = require("./routers/user");
const eventRouter = require("./routers/event");
const clubRouter = require("./routers/club");
const feedbackRouter = require("./routers/feedback");
const adminRouter = require("./routers/admin")
const teamRouter = require("./routers/team");
const clubAdminRouter = require("./routers/clubAdmin");
const globalErrorHandler = require("./utils/globalErrorHandler");

app.use("/users", userRouter);
app.use("/event", eventRouter);
app.use("/clubs", clubRouter);
app.use("/feedback", feedbackRouter);
app.use("/admin", adminRouter);
app.use("/teams", teamRouter);
app.use("/club-admin", clubAdminRouter);

// Global Error Handler
app.use(globalErrorHandler);


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
