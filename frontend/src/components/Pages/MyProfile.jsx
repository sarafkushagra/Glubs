import React from "react";

export default function MyProfile() {
  // Dummy data (replace with real API or context later)
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/100?img=3",
    eventsParticipated: 5,
    upcomingEvents: 2,
    paymentsDone: 3,
    organizedEvents: 1,
  };

  const participationHistory = [
    {
      name: "Hack the Future",
      date: "June 10, 2025",
      location: "Main Auditorium",
      certificate: "#",
    },
    {
      name: "Code Clash 3.0",
      date: "May 25, 2025",
      location: "Tech Hall 2",
      certificate: "#",
    },
    {
      name: "ML Bootcamp",
      date: "May 15, 2025",
      location: "Online",
      certificate: "#",
    },
  ];

  const upcoming = [
    { name: "AI Workshop", date: "July 18, 2025" },
    { name: "TechFest 2025", date: "August 2, 2025" },
  ];

  const badges = [
  {
    title: "Event Explorer",
    description: "Participated in 5+ events",
    icon: "🎟️",
  },
  {
    title: "Workshop Warrior",
    description: "Completed 3 technical workshops",
    icon: "💻",
  },
  {
    title: "Organizer Pro",
    description: "Successfully hosted an event",
    icon: "🎤",
  },
];



  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">My Profile</h1>

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 flex items-center gap-6">
        <img src={user.avatar} alt="avatar" className="w-20 h-20 rounded-full border" />
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-indigo-50 text-indigo-700 p-4 rounded-lg shadow text-center">
          <h3 className="text-2xl font-bold">{user.eventsParticipated}</h3>
          <p className="text-sm mt-1">Events Participated</p>
        </div>
        <div className="bg-purple-50 text-purple-700 p-4 rounded-lg shadow text-center">
          <h3 className="text-2xl font-bold">{user.upcomingEvents}</h3>
          <p className="text-sm mt-1">Upcoming Events</p>
        </div>
        <div className="bg-green-50 text-green-700 p-4 rounded-lg shadow text-center">
          <h3 className="text-2xl font-bold">{user.paymentsDone}</h3>
          <p className="text-sm mt-1">Payments Done</p>
        </div>
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg shadow text-center">
          <h3 className="text-2xl font-bold">{user.organizedEvents}</h3>
          <p className="text-sm mt-1">Events Organized</p>
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">Upcoming Events</h3>
        {upcoming.length === 0 ? (
          <p className="text-gray-500">No upcoming events.</p>
        ) : (
          <ul className="list-disc list-inside text-gray-700">
            {upcoming.map((event, idx) => (
              <li key={idx}>
                <span className="font-medium">{event.name}</span> — {event.date}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Participation History */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h3 className="text-xl font-semibold text-indigo-700 mb-4">Participation History</h3>
        {participationHistory.length === 0 ? (
          <p className="text-gray-500">You haven't participated in any events yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm text-left text-gray-700 border">
              <thead className="bg-indigo-50 text-indigo-800">
                <tr>
                  <th className="p-3">Event</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {participationHistory.map((event, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-3">{event.name}</td>
                    <td className="p-3">{event.date}</td>
                    <td className="p-3">{event.location}</td>
                    <td className="p-3">
                      <a
                        href={event.certificate}
                        className="text-indigo-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Achievements / Badges */}
<div className="bg-white p-6 rounded-xl shadow mb-10">
  <h3 className="text-xl font-semibold text-indigo-700 mb-4">Achievements & Badges</h3>
  {badges.length === 0 ? (
    <p className="text-gray-500">You haven't earned any badges yet.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className="bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg p-4 shadow hover:shadow-md transition transform hover:-translate-y-1"
        >
          <div className="text-4xl mb-2">{badge.icon}</div>
          <h4 className="font-bold text-lg">{badge.title}</h4>
          <p className="text-sm text-indigo-800">{badge.description}</p>
        </div>
      ))}
    </div>
  )}
</div>


      {/* More sections can go here (Achievements, Settings, etc.) */}
    </div>
  );
}
