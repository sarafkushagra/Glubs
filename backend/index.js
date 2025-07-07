 require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const mongoose = require("mongoose");

const dburl = process.env.ATLASDB_URL;
  
main().then(() => {
  console.log("Connected to MongoDB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}
app.get("/", (req, res) => {
  // res.send("Welcome to the Glubs Backend API"); 
  res.render("html/index.ejs");  
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const userRouter = require("./routers/user");
app.use("/users", userRouter);

const clubAdminRouter = require("./routers/clubadmin");
app.use("/clubadmins", clubAdminRouter);

const eventRouter = require("./routers/event");
app.use("/event", eventRouter);

const eventRegistrationRouter = require("./routers/eventreg");
app.use("/eventreg", eventRegistrationRouter);

const eventStatsRouter = require("./routers/eventstats");
app.use("/eventstat", eventStatsRouter);

const clubRouter = require("./routers/club");
app.use("/club", clubRouter);

const announcementRouter = require("./routers/announcement");
app.use("/announcement", announcementRouter);

const feedbackRouter = require("./routers/feedback");
app.use("/feedback", feedbackRouter);

const notificationRouter = require("./routers/notification");
app.use("/notification", notificationRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


