import { Mail } from "lucide-react";

const AboutSection = ({ club }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        👥 About the Club
      </h2>
      <p className="text-gray-600 leading-relaxed mb-6">{club.description}</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📍 Department</h3>
          <p className="text-gray-600">{club.department}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">📅 Founded</h3>
          <p className="text-gray-600">{club.founded}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">👤 Faculty Coordinator</h3>
          <p className="text-gray-600">{club.coordinator}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">👥 Members</h3>
          <p className="text-gray-600">{club.members} active members</p>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">📬 Contact Information</h3>
        <div className="flex flex-wrap gap-4">
          <a  className="flex items-center text-blue-600 hover:text-blue-800">
            <Mail className="w-4 h-4 mr-2" />
            {club.email}
          </a>
          <a href="#" className="text-pink-600 hover:text-pink-800">
            📷 {club.instagram}
          </a>
          <a href="#" className="text-blue-700 hover:text-blue-900">
            💼 {club.linkedin}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;