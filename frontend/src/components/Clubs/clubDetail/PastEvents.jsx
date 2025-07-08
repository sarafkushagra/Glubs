const PastEvents = ({ images }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        📸 Past Events & Gallery Preview
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {images.map((image, index) => (
          <div key={index} className="aspect-square rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer">
            <img src={image}  className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
        View Full Gallery
      </button>
    </div>
  );
};

export default PastEvents;