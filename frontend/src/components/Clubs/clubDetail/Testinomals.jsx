const Testimonials = ({ testimonials }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">💬 Student Feedback</h3>
      <div className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="border-l-4 border-blue-600 pl-4">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-yellow-400">⭐</span>
              ))}
            </div>
            <p className="text-gray-600 text-sm mb-2">"{testimonial.comment}"</p>
            <p className="text-gray-500 text-sm font-medium">- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;