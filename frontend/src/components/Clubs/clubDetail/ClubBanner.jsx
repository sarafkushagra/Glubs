import { MessageSquare, Images } from "lucide-react";

const ClubBanner = ({ club }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img src={club.image} alt={club.name} className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
        <div className="text-6xl">{club.logo}</div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{club.name}</h1>
          <p className="text-xl text-blue-100 mb-6">{club.tagline}</p>
          <div className="flex flex-wrap gap-3">
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Follow Club
            </button>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-400 transition-colors flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message Club
            </button>
            <button className="bg-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-400 transition-colors flex items-center">
              <Images className="w-4 h-4 mr-2" />
              View Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubBanner;