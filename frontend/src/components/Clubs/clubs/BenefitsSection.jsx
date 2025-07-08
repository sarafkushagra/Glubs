const BenefitsSection = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Benefits of Joining Our Clubs
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Network & Connect</h3>
          <p className="text-gray-600">Meet like-minded people and build lasting friendships with fellow students who share your interests.</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Develop Skills</h3>
          <p className="text-gray-600">Enhance your abilities through hands-on experience, workshops, and collaborative projects.</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏆</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Leadership Opportunities</h3>
          <p className="text-gray-600">Take on leadership roles, organize events, and make a positive impact in your community.</p>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;