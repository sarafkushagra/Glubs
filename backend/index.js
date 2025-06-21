const express = require("express");
const app = express();

const ClubAdmin = require("./schema/clubadmin");
const User = require("./schema/user");
const Event = require("./schema/event");
const EventStats = require("./schema/eventstats");
const EventRegistration = require("./schema/eventregistration");

const mongoose = require("mongoose");

main().then(() => {
  console.log("Connected to MongoDB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/glubs');
}


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});


