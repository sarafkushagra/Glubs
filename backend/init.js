const mongoose = require("mongoose");

const Auth = require("./schema/auth");
const ClubAdmin = require("./schema/clubadmin");
const User = require("./schema/user");
const Event = require("./schema/event");
const EventStats = require("./schema/eventstats");
const EventRegistration = require("./schema/eventregistration");

// Adding data to the auth schema
// Example Auth data
let auth1 = new Auth({
    email: "ksaraf0004@gmail.com",
    password: "password123",
    role: "admin"
});
auth1.save()
.then(() => {
  console.log("Auth saved successfully");
});

// Adding data to the club admin schema
// Example Club Admin data
let clubAdmin1 = new ClubAdmin({
    auth: auth1._id,
    name: "Kushagra Saraf",
    club: "Glubs",
    position: "President",
    year: "2024",
    department: "Computer Science",
    universityRollNo: "CS2024001"
}); 
clubAdmin1.save()
.then(() => {
  console.log("Club Admin saved successfully");
});

// Adding data to the user schema
let user1 = new User({
    auth: auth1._id,
    name: "Kushagra Saraf",
    age: 20,
    yearOfStudy: "2nd Year",
    department: "Computer Science",
    isClubMember: true,
    clubName: "Glubs"
});     
user1.save()
.then(() => {
  console.log("User saved successfully");
});

// Adding data to the event schema
let event1 = new Event({
    title: "Tech Fest",
    description: "A festival of technology and innovation.",
    date: new Date("2024-05-01"),
    time: "10:00 AM",
    venue: "Main Auditorium",
    club: "Glubs",
    createdBy: clubAdmin1._id
}); 
event1.save()
.then(() => {
  console.log("Event saved successfully");
});

// Adding data to the event stats schema
let eventStats1 = new EventStats({
    event: event1._id,
    totalRegistrations: 100
});
eventStats1.save()
.then(() => {
  console.log("Event Stats saved successfully");
});

// Adding data to the event registration schema
let eventRegistration1 = new EventRegistration({
    eventId: event1._id,
    userId: user1._id,
    qrCode: "QR123456",
    isScanned: false,
    registrationDate: new Date(),
    status: "Registered"
});
eventRegistration1.save()
.then(() => {
  console.log("Event Registration saved successfully");
});


main().then(() => {
  console.log("Connected to MongoDB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/glubs');
}