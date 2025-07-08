import { Link } from "react-router-dom";

const ClubCard = ({ club }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-blue-200">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl bg-gray-50 rounded-lg p-2 shadow-sm">{club.logo}</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 mb-2">{club.name}</h3>
            <p className="text-gray-600 text-sm">{club.tagline}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
          <span className="flex items-center">
            📍 Dept: <span className="ml-1 font-medium text-gray-700">{club.department}</span>
          </span>
          <span className="flex items-center">
            👤 <span className="ml-1 font-medium text-gray-700">{club.members}</span> Members
          </span>
        </div>
        
        <div className="flex gap-3">
          <button className="flex-1 bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition-colors font-medium border border-green-200">
            Follow ✅
          </button>
          <Link 
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium shadow-md hover:shadow-lg"
          >
            View Club
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;