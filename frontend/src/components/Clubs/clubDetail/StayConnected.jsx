const StayConnected = () => {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-4">📣 Stay Connected</h3>
      <div className="space-y-3">
        <button className="w-full bg-white text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium">
          Follow Updates
        </button>
        <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium">
          Join WhatsApp Group
        </button>
        <button className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors font-medium">
          Follow LinkedIn
        </button>
      </div>
    </div>
  );
};

export default StayConnected;