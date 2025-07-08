const Achievements = ({ achievements }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">🧾 Achievements & Impact</h3>
      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <div key={index} className="flex items-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
            <span className="text-gray-700">{achievement}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;