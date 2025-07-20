
// Final corrected init.js to permanently fix 'passwordConfirm' validation error during seeding
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const faker = require("@faker-js/faker").faker;

const User = require("./schema/user");
const Event = require("./schema/event");
const Club = require("./schema/club");

const dburl = process.env.MONGO_URL;

async function seedDB() {
    try {
        await mongoose.connect(dburl);
        console.log("✅ Connected to MongoDB");

        await User.deleteMany({});
        await Event.deleteMany({});
        await Club.deleteMany({});

        const plainPassword = "Password@123";
        const hashedPassword = await bcrypt.hash(plainPassword, 12);
        const users = [];
        for (let i = 0; i < 50; i++) {
            users.push({
                username: faker.internet.username(),
                email: faker.internet.email().toLowerCase(),
                password: plainPassword, // provide plain for validation
                passwordConfirm: plainPassword, // must match plain password
                role: "student",
                yearOfStudy: faker.helpers.arrayElement(["1st Year", "2nd Year", "3rd Year", "4th Year"]),
                department: faker.commerce.department(),
                isClubMember: faker.datatype.boolean()
            });
        }
        const userDocs = await User.insertMany(users);
        console.log(`✅ Inserted ${userDocs.length} users`);

        if (userDocs.length === 0) throw new Error("No users inserted, cannot proceed with clubs and events.");

        const clubs = [];
        for (let i = 0; i < 10; i++) {
            clubs.push({
                name: faker.company.name(),
                description: faker.company.catchPhrase(),
                members: faker.helpers.arrayElements(userDocs.map(u => u._id), 5),
                events: []
            });
        }
        const clubDocs = await Club.insertMany(clubs);
        console.log(`✅ Inserted ${clubDocs.length} clubs`);

        const events = [];
        for (let i = 0; i < 20; i++) {
            const event = {
                title: faker.lorem.words(3),
                description: faker.lorem.sentences(2),
                eventType: faker.helpers.arrayElement(["Hackathon", "Workshop", "Seminar", "Other"]),
                date: faker.date.future(),
                venue: faker.location.city(),
                createdBy: faker.helpers.arrayElement(userDocs)._id,
                club: faker.helpers.arrayElement(clubDocs)._id, // ✅ now assigning a valid club id
                media: [{ type: "image", url: faker.image.url() }],
                registeredUsers: faker.helpers.arrayElements(userDocs.map(u => u._id), 10),
            };
            events.push(event);
        }
        const eventDocs = await Event.insertMany(events);
        console.log(`✅ Inserted ${eventDocs.length} events`);

        for (let event of eventDocs) {
            const randomClub = faker.helpers.arrayElement(clubDocs);
            randomClub.events.push(event._id);
            await randomClub.save();
        }

        console.log("🌱 Seeding completed successfully.");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
seedDB();

