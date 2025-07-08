const UpcomingEvents = ({ events }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        📅 Upcoming Events
      </h2>
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <h3 className="font-semibold text-lg text-gray-900">{event.title}</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">📅 {event.date}</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Register
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{event.description}</p>
            <p className="text-sm text-red-600">⏰ Registration deadline: {event.deadline}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;