require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const mongoose = require("mongoose");

const dburl = process.env.MONGO_URL;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

main().then(() => {
  console.log("Connected to MongoDB");
})
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./routers/user");
app.use("/users", userRouter);

const eventRouter = require("./routers/event");
app.use("/event", eventRouter);

const clubRouter = require("./routers/club");
app.use("/clubs", clubRouter);

const feedbackRouter = require("./routers/feedback");
app.use("/feedback", feedbackRouter);

const notificationRouter = require("./routers/notification");
app.use("/notification", notificationRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


