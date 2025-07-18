const mongoose = require("mongoose");
const faker = require('@faker-js/faker').faker;
const bcrypt = require('bcrypt');
 require("dotenv").config();    
const dburl = process.env.ATLASDB_URL;

const Auth = require("./schema/auth");
const User = require("./schema/user");
const Event = require("./schema/event");
const Club = require("./schema/club");
const feedback = require("./schema/feedback");
const notification = require("./schema/notification");

const seedDB = async () => {
    await mongoose.connect(dburl);

    await Auth.deleteMany({});
    await User.deleteMany({});
    await Club.deleteMany({});
    await Event.deleteMany({});
    await notification.deleteMany({});
    await feedback.deleteMany({});

    const passwordHash = await bcrypt.hash('Password@123', 10);

    let authUsers = [];
    let authClubAdmins = [];
    let userDocs = [];
    let clubAdminDocs = [];
    let clubs = [];

    // Seed Auth users
    for (let i = 0; i < 100; i++) {
        let role = faker.helpers.arrayElement(['user', 'club-admin', 'admin']);
        let auth = new Auth({
            email: faker.internet.email(),
            password: passwordHash,
            role
        });
        await auth.save();
        if (role === 'user') authUsers.push(auth);
        if (role === 'club-admin') authClubAdmins.push(auth);
    }

    // Seed ClubAdmins
for (let auth of authClubAdmins) {
    const clubAdmin = new User({
        auth: auth._id,
        name: faker.person.fullName(),
        age: faker.number.int({ min: 22, max: 30 }),
        yearOfStudy: `Year ${faker.number.int({ min: 1, max: 4 })}`,
        department: faker.commerce.department(),
        isClubMember: false // usually admins aren't members
    });
    await clubAdmin.save();
    clubAdminDocs.push(clubAdmin);
}


    // Seed Users
    for (let auth of authUsers) {
        const user = new User({
            auth: auth._id,
            name: faker.person.fullName(),
            age: faker.number.int({ min: 18, max: 25 }),
            yearOfStudy: `Year ${faker.number.int({ min: 1, max: 4 })}`,
            department: faker.commerce.department(),
            isClubMember: faker.datatype.boolean()
        });
        await user.save();
        userDocs.push(user);
    }

    // Seed Clubs
    for (let i = 0; i < 30; i++) {
        const club = new Club({
            name: faker.company.name(),
            description: faker.lorem.sentence(),
            createdBy: faker.helpers.arrayElement(clubAdminDocs)._id,
            members: faker.helpers.arrayElements(userDocs.map(u => u._id), faker.number.int({ min: 3, max: 10 }))
        });
        await club.save();
        clubs.push(club);
    }

    // Update Users with club reference
    for (let user of userDocs) {
        if (user.isClubMember) {
            user.club = faker.helpers.arrayElement(clubs)._id;
            await user.save();
        }
    }

    // Seed Events
    let events = [];
    for (let i = 0; i < 100; i++) {
        const event = new Event({
            title: faker.lorem.words(5),
            description: faker.lorem.sentences(2),
            eventType: faker.helpers.arrayElement(['Hackathon', 'Workshop', 'Seminar', 'Other']),
            date: faker.date.future(),
            venue: faker.location.city(),
            createdBy: faker.helpers.arrayElement(clubAdminDocs)._id,
            media: [{
                type: 'image',
                url: faker.image.url()
            }],
            registeredUsers: faker.helpers.arrayElements(userDocs.map(u => u._id), faker.number.int({ min: 5, max: 20 })),
            comments: [],
            views: faker.number.int({ min: 10, max: 1000 }),
            registrations: faker.number.int({ min: 5, max: 50 }),
            commentsCount: faker.number.int({ min: 0, max: 20 })
        });
        await event.save();
        events.push(event);
    }


    // Seed Feedback
    for (let i = 0; i < 100; i++) {
        const fb = new feedback({
            event: faker.helpers.arrayElement(events)._id,
            user: faker.helpers.arrayElement(userDocs)._id,
            rating: faker.number.int({ min: 1, max: 5 }),
            review: faker.lorem.sentences(2)
        });
        await fb.save();
    }

    console.log('✅ Seeding completed successfully.');
    process.exit();
};

seedDB();