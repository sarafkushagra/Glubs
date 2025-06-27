const express = require("express");
const app = express();

const mongoose = require("mongoose");
  
main().then(() => {
  console.log("Connected to MongoDB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/glubs');
}
app.get("/", (req, res) => {
  res.send("Welcome to the Glubs Backend API");   
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./routers/user");
app.use("/", userRouter);

const clubAdminRouter = require("./routers/clubadmin");
app.use("/", clubAdminRouter);

const eventRouter = require("./routers/event");
app.use("/", eventRouter);

const eventRegistrationRouter = require("./routers/eventreg");
app.use("/", eventRegistrationRouter);

const eventStatsRouter = require("./routers/eventstats");
app.use("/", eventStatsRouter);


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


